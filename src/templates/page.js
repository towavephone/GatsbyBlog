import React, { Component } from 'react';
import PropTypes from 'prop-types';
import events from 'dom-helpers/events';

import Pagination from '../components/Pagination';
import Posts from '../components/Posts';
import Separator from '../components/Separator';
import MetaTags from '../components/MetaTags';

export default class Pages extends Component {
  componentDidMount() {
    events.on(window, 'keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    events.off(window, 'keydown', this.handleKeyDown);
  }

  handleKeyDown = (event) => {
    const { code } = event
    const { history, pathContext } = this.props
    const { prevPath, nextPath } = pathContext

    const handlePreNext = (path) => {
      if (!path) {
        return
      }

      history.push(path)
    }

    const funcMap = {
      ArrowLeft: () => handlePreNext(prevPath),
      ArrowRight: () => handlePreNext(nextPath)
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
