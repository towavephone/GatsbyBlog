/* global graphql */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GatsbyLink from 'gatsby-link';
import Img from 'gatsby-image';
import events from 'dom-helpers/events';
import { get } from 'lodash'

import Separator from './../components/Separator';
import Posts from './../components/Posts';
import MetaTags from './../components/MetaTags';
import WebPageSchema from '../components/schemas/WebPageSchema';

const MAX_POSTS = 3;

export default class Index extends Component {
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
    events.on(window, 'keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    events.off(window, 'keydown', this.handleKeyDown);
  }

  handleKeyDown = (event) => {
    const { code, ctrlKey, shiftKey } = event
    if (!ctrlKey || !shiftKey) {
      return
    }

    const { history, data } = this.props
    const { edges } = data.allMarkdownRemark

    const funcMap = {
      ArrowRight: () => history.push('/page/1'),
    }

    const jumpToPost = (index) => history.push(get(edges, `${index}.node.frontmatter.path`))

    for (let i = 0; i < MAX_POSTS; i++) {
      funcMap[`Digit${i + 1}`] = () => jumpToPost(i)
      funcMap[`Numpad${i + 1}`] = () => jumpToPost(i)
    }

    funcMap[code] && funcMap[code]()
  }

  render() {
    let { edges } = this.props.data.allMarkdownRemark;
    let { siteUrl, description, author } = this.props.data.site.siteMetadata;
    let length = edges.length;
    // 限制首页展示文章
    // 注意此处需深拷贝，否则再次回到首页看不到阅读更多
    let [...posts] = edges;
    posts.length = MAX_POSTS;
    posts = posts.map((post) => post.node);

    return (
      <div>
        <WebPageSchema title={author} description={description} url={siteUrl} />
        <MetaTags noIndex={false} tags='' title={'首页'} description={description} siteUrl={siteUrl} path={'/'} />
        <section className='blog container'>
          <div className='medium-8 medium-offset-2 large-10 large-offset-1'>
            <div className='blog-header'>
              <GatsbyLink to='/' className='blog-header__link' itemProp='name'>
                <Img className='header-avatar blog-header__img' alt={author} sizes={this.props.data.file.childImageSharp.sizes} />
              </GatsbyLink>
              <h2>{author}</h2>
              <p className='header-description' dangerouslySetInnerHTML={{ __html: description }} />
            </div>
            <header className='header'>最近文章</header>
            <Separator />
            <div className='posts'>
              <Posts posts={posts} />
              <Separator />
              <article className='post text-right'>
                <header className='post-head'>
                  <h3 className='post-title'>
                    {length > MAX_POSTS ? <GatsbyLink to='/page/1'>阅读更多 &gt;</GatsbyLink> : null}
                  </h3>
                </header>
              </article>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

Index.propTypes = {
  data: PropTypes.object
};

export const pageQuery = graphql`
  query IndexQuery {
    file(relativePath: { eq: "avatar.png" }) {
      childImageSharp {
        sizes {
          ...GatsbyImageSharpSizes_withWebp
        }
      }
    }
    site {
      siteMetadata {
        description
        siteUrl
        author
      }
    }
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: 4
      filter: { frontmatter: { draft: { ne: true } } }
    ) {
      edges {
        node {
          excerpt(pruneLength: 250)
          id
          frontmatter {
            title
            date(formatString: "YYYY-MM-DD HH:mm:ss")
            path
            tags
            draft
          }
        }
      }
    }
  }
`;
