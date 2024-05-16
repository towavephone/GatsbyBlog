---
title: Python 语法解析器实现复杂搜索
categories:
   - 后端
path: /python-search-by-syntax/
tags: 后端, python, 预研
date: 2024-05-15 18:09:57
---

# 背景

1. 针对 postgres 某个表里面的 labels 字段（labels 字段是一维数组类型）做复杂查询，要求支持常见的且，或，非等等功能
2. 原来的业务逻辑已实现了且，或，非功能，但不支持括号来提高运算符的优先级

# 方案

显而易见的方案就是实现一个 python 版本的语法解析器来支持各种语法，有以下方案

1. [ply](https://github.com/dabeaz/ply) 语法简单易懂，上手有一定难度
2. [pyparsing](https://github.com/pyparsing/pyparsing) 语义结构化比较好，比 ply 上手难度要高

综上，采用方案 1

# 实现

由于后端使用的 django 框架，根据数据库的不同以及 orm 的不同，操作数据库一般有 3 种形式

1. 原生 postgres sql 查询
2. django Q 对象查询
3. 原生 mongodb sql 查询

结合业务，只需要实现 1, 2，主要功能如下

1. () - , | % 分别代表左括号、右括号、非、且、或、模糊搜索，优先级 () > % > - > , > |
2. 如果要搜索的 label 带有上述字符，可以用 \\ 转义，不是开头的 -、% 可以不用转义

## 原生 postgres sql 查询

`utils/pg_sql_utils.py`

```py
import re

from pydash import py_


def replace_dashes(match):
    result = match.group()
    first_char = ''

    if result.startswith('-'):
        first_char = '-'
        result = result[1:]

    return first_char + re.sub(r'(?<!\\)-', r'\-', result)


def parse_sql(common_expression, like_expression, sql):
    # () - , | 分别代表左右括号，非，且，或，优先级 () > - > , > |，如果要搜索的 label 带有上述 5 种字符，可以用 \ 转义，非开头的 - 不需要转义
    sql = sql.strip()
    if not sql:
        return ''

    # 预处理，将筛选出 - 开头的匹配项，然后对匹配项里面除了开头的 - 以外的 - 替换为 \-，最后将替换的结果拼接到原字符串
    # 就是将下面的 [^()|,-])+ 改为 [^()|,])+，在这里处理替换 - 开头的情况，即将剩余的 - 替换为 \-
    pattern = r'((?:\\[()|,-])|[^()|,])+'
    sql = re.sub(pattern, replace_dashes, sql)

    print('sql:', sql)

    import ply.lex as lex
    import ply.yacc as yacc

    # 定义词法分析器的词法规则
    tokens = (  # noqa: F841
        'LPAREN',
        'RPAREN',
        'OR',
        'AND',
        'NOT',
        'TERM',
    )

    t_LPAREN = r'\('  # noqa: F841
    t_RPAREN = r'\)'  # noqa: F841
    t_OR = r'\|'  # noqa: F841
    t_AND = r','  # noqa: F841
    t_NOT = r'-'  # noqa: F841

    def t_TERM(t):
        # 匹配以 ()|,- 的分割的连续字符，但是要忽略转义字符 \，如 \- 表示匹配 -
        r'((?:\\[()|,-])|[^()|,-])+'
        # 去掉转义字符 \
        if t.value.startswith('\%'):
            t.value = '\%' + re.sub(r'\\([()|,\-%])', r'\1', t.value[2:])
        else:
            t.value = re.sub(r'\\([()|,\-%])', r'\1', t.value)
        return t

    # 忽略空格和制表符
    t_ignore = ' \t'  # noqa: F841

    # 错误处理
    def t_error(t):
        raise TypeError("Unknown text '%s'" % (py_.get(t, 'value'),))

    # 构建词法分析器
    lexer = lex.lex()

    # 确定运算符的优先级
    precedence = (  # noqa: F841
      ('left', 'OR'),
      ('left', 'AND'),
      ('right', 'NOT')
    )

    # 定义语法分析器的语法规则
    def p_expression_group(p):
        '''expression : LPAREN expression RPAREN'''
        p[0] = f'({p[2]})'

    def p_expression_or(p):
        '''expression : expression OR expression'''
        p[0] = f'{p[1]} OR {p[3]}'

    def p_expression_and(p):
        '''expression : expression AND expression'''
        p[0] = f'{p[1]} AND {(p[3])}'

    def p_expression_not(p):
        '''expression : NOT expression'''
        p[0] = f'NOT {p[2]}'

    def p_expression_term(p):
        '''expression : TERM'''
        if p[1].startswith('%'):
            p[0] = like_expression.format(
                value=p[1][1:])
        else:
            if p[1].startswith('\%'):
                p[1] = p[1][1:]
            p[0] = common_expression.format(
                value=p[1])

    def p_error(p):
        raise SyntaxError(
            f"Syntax error in input! Text is {sql}, Token is {py_.get(p, 'value')}")

    # 构建语法分析器
    parser = yacc.yacc()
    result = parser.parse(sql, lexer=lexer)
    return result


if __name__ == '__main__':
    common_expression = "labels::TEXT[] @> ARRAY ['{value}']"
    like_expression = "labels::TEXT LIKE '%{value}%'"
    print(
        parse_sql(common_expression, like_expression, 'a|-直行路口,-free-,\,\(\)\|space专项,(b|c),(d,e),%3434,\%3434'))
    print(
        parse_sql(common_expression, like_expression, '-ego\-turn\-right,ego-turn\-right,ego-turn-right,v4.0.4-f30-ota31-pro,v4.0.4\-f30\-ota31\-pro'))
```

```bash
sql: a|-直行路口,-free\-,\,\(\)\|space专项,(b|c),(d,e),%3434,\%3434

labels::TEXT[] @> ARRAY ['a'] OR NOT labels::TEXT[] @> ARRAY ['直行路口'] AND NOT labels::TEXT[] @> ARRAY ['free-'] AND labels::TEXT[] @> ARRAY [',()|space专项'] AND (labels::TEXT[] @> ARRAY ['b'] OR labels::TEXT[] @> ARRAY ['c']) AND (labels::TEXT[] @> ARRAY ['d'] AND labels::TEXT[] @> ARRAY ['e']) AND labels::TEXT LIKE '%3434%' AND labels::TEXT[] @> ARRAY ['%3434']


sql: -ego\-turn\-right,ego\-turn\-right,ego\-turn\-right,v4.0.4\-f30\-ota31\-pro,v4.0.4\-f30\-ota31\-pro

NOT labels::TEXT[] @> ARRAY ['ego-turn-right'] AND labels::TEXT[] @> ARRAY ['ego-turn-right'] AND labels::TEXT[] @> ARRAY ['ego-turn-right'] AND labels::TEXT[] @> ARRAY ['v4.0.4-f30-ota31-pro'] AND labels::TEXT[] @> ARRAY ['v4.0.4-f30-ota31-pro']
```

## django Q 对象查询

`utils/q_sql_utils.py`

```py
import re

from pydash import py_
from django.db.models import Q


def replace_dashes(match):
    result = match.group()
    first_char = ''

    if result.startswith('-'):
        first_char = '-'
        result = result[1:]

    return first_char + re.sub(r'(?<!\\)-', r'\-', result)


def parse_q(common_expression, like_expression, sql):
    # () - , | 分别代表左右括号，非，且，或，优先级 () > - > , > |，如果要搜索的 label 带有上述 5 种字符，可以用 \ 转义，非开头的 - 不需要转义
    sql = sql.strip()
    if not sql:
        return ''

    # 预处理，将筛选出 - 开头的匹配项，然后对匹配项里面除了开头的 - 以外的 - 替换为 \-，最后将替换的结果拼接到原字符串
    # 就是将下面的 [^()|,-])+ 改为 [^()|,])+，在这里处理替换 - 开头的情况，即将剩余的 - 替换为 \-
    pattern = r'((?:\\[()|,-])|[^()|,])+'
    sql = re.sub(pattern, replace_dashes, sql)

    print('sql:', sql)

    import ply.lex as lex
    import ply.yacc as yacc

    # 定义词法分析器的词法规则
    tokens = (  # noqa: F841
        'LPAREN',
        'RPAREN',
        'OR',
        'AND',
        'NOT',
        'TERM',
    )

    t_LPAREN = r'\('  # noqa: F841
    t_RPAREN = r'\)'  # noqa: F841
    t_OR = r'\|'  # noqa: F841
    t_AND = r','  # noqa: F841
    t_NOT = r'-'  # noqa: F841

    def t_TERM(t):
        # 匹配以 ()|,- 的分割的连续字符，但是要忽略转义字符 \，如 \- 表示匹配 -
        r'((?:\\[()|,-])|[^()|,-])+'
        # 去掉转义字符 \
        if t.value.startswith('\%'):
            t.value = '\%' + re.sub(r'\\([()|,\-%])', r'\1', t.value[2:])
        else:
            t.value = re.sub(r'\\([()|,\-%])', r'\1', t.value)
        return t

    # 忽略空格和制表符
    t_ignore = ' \t'  # noqa: F841

    # 错误处理
    def t_error(t):
        raise TypeError("Unknown text '%s'" % (py_.get(t, 'value'),))

    # 构建词法分析器
    lexer = lex.lex()

    # 确定运算符的优先级
    precedence = (  # noqa: F841
      ('left', 'OR'),
      ('left', 'AND'),
      ('right', 'NOT')
    )

    # 定义语法分析器的语法规则
    def p_expression_group(p):
        '''expression : LPAREN expression RPAREN'''
        p[0] = (p[2])

    def p_expression_or(p):
        '''expression : expression OR expression'''
        p[0] = Q(p[1]) | Q(p[3])

    def p_expression_and(p):
        '''expression : expression AND expression'''
        p[0] = Q(p[1]) & Q(p[3])

    def p_expression_not(p):
        '''expression : NOT expression'''
        p[0] = ~Q(p[2])

    def p_expression_term(p):
        '''expression : TERM'''
        if p[1].startswith('%'):
            p[0] = Q(**like_expression(p[1][1:]))
        else:
            if p[1].startswith('\%'):
                p[1] = p[1][1:]
            p[0] = Q(**common_expression(p[1]))

    def p_error(p):
        raise SyntaxError(
            f"Syntax error in input! Text is {sql}, Token is {py_.get(p, 'value')}")

    # 构建语法分析器
    parser = yacc.yacc()
    result = parser.parse(sql, lexer=lexer)
    return result


if __name__ == '__main__':
    def common_expression(value): return {'labels__contains': [value]}
    def like_expression(value): return {'labels__regex': r'%s' % value}

    print(
        parse_q(common_expression, like_expression, 'a|-直行路口,-free-,\,\(\)\|space专项,(b|c),(d,e),%3434,\%3434'))
    print(
        parse_q(common_expression, like_expression, '-ego\-turn\-right,ego-turn\-right,ego-turn-right,v4.0.4-f30-ota31-pro,v4.0.4\-f30\-ota31\-pro'))
```

```sql
sql: a|-直行路口,-free\-,\,\(\)\|space专项,(b|c),(d,e),%3434,\%3434

(OR: (AND: ('labels__contains', ['a'])), (AND: (AND: (AND: (AND: (AND: (AND: (NOT (AND: (AND: ('labels__contains', ['直行路口'])))), (NOT (AND: (AND: ('labels__contains', ['free-']))))), (AND: ('labels__contains', [',()|space专项']))), (OR: (AND: ('labels__contains', ['b'])), (AND: ('labels__contains', ['c'])))), (AND: (AND: ('labels__contains', ['d'])), (AND: ('labels__contains', ['e'])))), (AND: ('labels__regex', '3434'))), (AND: ('labels__contains', ['%3434']))))


sql: -ego\-turn\-right,ego\-turn\-right,ego\-turn\-right,v4.0.4\-f30\-ota31\-pro,v4.0.4\-f30\-ota31\-pro

(AND: (AND: (AND: (AND: (NOT (AND: (AND: ('labels__contains', ['ego-turn-right'])))), (AND: ('labels__contains', ['ego-turn-right']))), (AND: ('labels__contains', ['ego-turn-right']))), (AND: ('labels__contains', ['v4.0.4-f30-ota31-pro']))), (AND: ('labels__contains', ['v4.0.4-f30-ota31-pro'])))
```
