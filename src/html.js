/* eslint  react/prop-types: 0 */
import React from 'react';

export default class HTML extends React.Component {
  componentDidMount() {
    const data = [
      { 快捷键: 'ctrl + shift + arrow left', 说明: '向上翻页（上一篇文章）' },
      { 快捷键: 'ctrl + shift + arrow right', 说明: '向下翻页（下一篇文章）' },
      { 快捷键: 'ctrl + shift + number 1', 说明: '跳转到第 1 个文章' },
      { 快捷键: 'ctrl + shift + number n', 说明: '跳转到第 n 个文章' },
      { 快捷键: 'ctrl + shift + backslash', 说明: '打开或收起目录' },
      { 快捷键: 'alt + arrow left', 说明: '历史记录向前' },
      { 快捷键: 'alt + arrow right', 说明: '历史记录向后' }
    ];
    // eslint-disable-next-line no-console
    console.table(data);
  }

  render() {
    let css;
    if (process.env.NODE_ENV === 'production') {
      css = (
        <style
          dangerouslySetInnerHTML={{
            __html: require('!raw!../public/styles.css')
          }}
        />
      );
    }

    return (
      <html lang='en'>
        <head>
          <meta charSet='utf-8' />
          <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
          <meta name='viewport' content='width=device-width, initial-scale=1.0' />
          {this.props.headComponents}
          {css}
        </head>
        <body itemScope itemType='http://schema.org/WebPage'>
          <div id='___gatsby' dangerouslySetInnerHTML={{ __html: this.props.body }} />
          {this.props.postBodyComponents}
          <script src='/js/smooth-scroll.min.js' />
          <script src='/js/lazyload.min.js' />
        </body>
      </html>
    );
  }
}
