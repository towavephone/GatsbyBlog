/* global graphql */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import events from 'dom-helpers/events';
import { get } from 'lodash';

import Posts from '../components/Posts';
import Pagination from '../components/TagsPagination';
import Separator from '../components/Separator';
import MetaTags from '../components/MetaTags';

const MAX_POSTS = 5;

export default class Tags extends Component {
  componentDidMount() {
    events.on(window, 'keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    events.off(window, 'keydown', this.handleKeyDown);
  }

  handleKeyDown = (event) => {
    const { code, ctrlKey, shiftKey } = event;
    if (!ctrlKey || !shiftKey) {
      return;
    }

    const { history, pathContext } = this.props;
    const { page, posts, tag } = pathContext;

    const getPagePath = (current) => current === 1 ? `/tag/${tag}/` : `/tag/${tag}/page/${current}/`

    const handlePreNext = (path) => {
      if (!path) {
        return;
      }

      history.push(path);
    };

    const handlePre = (path) => {
      if (page === 1) {
        history.push('/');
        return;
      }

      handlePreNext(path);
    };

    const funcMap = {
      ArrowLeft: () => handlePre(getPagePath(page - 1)),
      ArrowRight: () => handlePreNext(getPagePath(page + 1))
    };

    const jumpToPost = (index) => history.push(get(posts, `${index}.frontmatter.path`));

    for (let i = 0; i < MAX_POSTS; i++) {
      funcMap[`Digit${i + 1}`] = () => jumpToPost(i);
      funcMap[`Numpad${i + 1}`] = () => jumpToPost(i);
    }

    funcMap[code] && funcMap[code]();
  };

  render() {
    const { siteUrl } = this.props.data.site.siteMetadata;
    const { posts, tag, pagesSum, page, length } = this.props.pathContext;

    return (
      <section className='main-content'>
        <MetaTags
          title={`Tag ${tag}`}
          description={`All posts talking about ${tag}`}
          tags={tag}
          siteUrl={siteUrl}
          path={`/tag/${tag}`}
          noIndex={false}
        />
        <section className='blog container tags-collection'>
          <div className='medium-8 medium-offset-2 large-10 large-offset-1'>
            <header className='header'>
              <h1 className='tag-title tag-page-title'>{tag}</h1>
            </header>
            <section className='tag-meta'>共 {length} 篇文章</section>

            <div className='posts'>
              <Pagination page={page} pagesSum={pagesSum} tag={tag} />
              <Separator />
              <Posts posts={posts} />
              <Separator />
              <Pagination page={page} pagesSum={pagesSum} tag={tag} />
            </div>
          </div>
        </section>
      </section>
    );
  }
}

Tags.propTypes = {
  data: PropTypes.object,
  pathContext: PropTypes.object
};

export const tagsQuery = graphql`
  query TagsSiteMetadata {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
  }
`;
