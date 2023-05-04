/* global graphql */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GatsbyLink from 'gatsby-link';
import events from 'dom-helpers/events';
import { get } from 'lodash';

import Separator from './../components/Separator';
import Posts from './../components/Posts';
import MetaTags from './../components/MetaTags';

const MAX_POSTS = 3;

export default class Drafts extends Component {
  componentDidMount() {
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
      ArrowRight: () => history.push('/drafts/page/1'),
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
    let { siteUrl } = this.props.data.site.siteMetadata;
    let length = edges.length;
    let [...posts] = edges;
    posts.length = MAX_POSTS;
    posts = posts.map((post) => post.node);
    return (
      <div>
        <MetaTags
          siteUrl={siteUrl}
          path={'/drafts'}
          title={`草稿`}
          tags=''
          description={'这些是未完成的草稿页'}
          noIndex={true}
        />
        <section className='blog container'>
          <div className='medium-8 medium-offset-2 large-10 large-offset-1'>
            <header className='header'>草稿</header>
            <p className='drafts-description'>这些是未完成的草稿页</p>
            <Separator />
            <div className='posts'>
              <Posts posts={posts} />
              <Separator />
              <article className='post text-right'>
                <header className='post-head'>
                  {length > MAX_POSTS ? (
                    <h3 className='post-title'>
                      <GatsbyLink to='/drafts/page/1'>阅读更多 &gt;</GatsbyLink>
                    </h3>
                  ) : null}
                </header>
              </article>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

Drafts.propTypes = {
  data: PropTypes.object
};

export const pageQuery = graphql`
  query DraftsQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: 4
      filter: { frontmatter: { draft: { eq: true } } }
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
