import React, { Component } from 'react';
import PropTypes from 'prop-types';
import events from 'dom-helpers/events';
import { get } from 'lodash';

import Pagination from '../components/Pagination';
import Posts from '../components/Posts';
import Separator from '../components/Separator';
import MetaTags from '../components/MetaTags';

const MAX_POSTS = 5;

export default class Pages extends Component {
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

    const { history, pathContext } = this.props
    const { prevPath, nextPath, page, posts } = pathContext

    const handlePreNext = (path) => {
      if (!path) {
        return
      }

      history.push(path)
    }

    const handlePre = (path) => {
      if (page === 1) {
        const pathname = get(history, 'location.pathname', '')

        if (pathname.startsWith('/drafts/page')) {
          history.push('/drafts')
        } else {
          history.push('/')
        }

        return
      }

      handlePreNext(path)
    }

    const funcMap = {
      ArrowLeft: () => handlePre(prevPath),
      ArrowRight: () => handlePreNext(nextPath)
    }

    const jumpToPost = (index) => history.push(get(posts, `${index}.frontmatter.path`))

    for (let i = 0; i < MAX_POSTS; i++) {
      funcMap[`Digit${i + 1}`] = () => jumpToPost(i)
      funcMap[`Numpad${i + 1}`] = () => jumpToPost(i)
    }

    funcMap[code] && funcMap[code]()
  }

  render() {
    const { description, siteUrl } = this.props.data.site.siteMetadata;
    const { posts, page, pagesSum, prevPath, nextPath, length } = this.props.pathContext;
    return (
      <section className='main-content'>
        <MetaTags
          title={`第 ${page} 页`}
          path={`/page/${page}`}
          siteUrl={siteUrl}
          tags='webdev, programming, javascript'
          description={description}
          noIndex={false}
        />
        <section className='blog container'>
          <div className='medium-8 medium-offset-2 large-10 large-offset-1 tags-collection'>
            <header className='header'>
              <h1 className='tag-title tag-page-title'>全部</h1>
            </header>
            <section className='tag-meta'>共 {length} 篇文章</section>
            <div className='posts'>
              <Pagination page={page} pagesSum={pagesSum} prevPath={prevPath} nextPath={nextPath} />
              <Separator />
              <Posts posts={posts} />
              <Separator />
              <Pagination page={page} pagesSum={pagesSum} prevPath={prevPath} nextPath={nextPath} />
            </div>
          </div>
        </section>
      </section>
    );
  }
}

Pages.propTypes = {
  pathContext: PropTypes.object,
  data: PropTypes.object
};

export const pagesQuery = graphql`
  query PagesSiteMetadata {
    site {
      siteMetadata {
        description
        siteUrl
      }
    }
  }
`;
