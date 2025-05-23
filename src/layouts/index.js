import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import GatsbyLink from 'gatsby-link';
import events from 'dom-helpers/events';
import domQuery from 'dom-helpers/query';
import { throttle, get } from 'lodash';
import cx from 'classnames';

import { isEmptyObject } from '../utils/common';
import Icon from '../components/Icon';
import Menu from '../components/Menu';
import '../scss/boot.scss';
import Footer from '../components/Footer';

export default class IndexLayout extends Component {
  constructor(props) {
    super(props);
    this.isProduction = process.env.NODE_ENV === 'production';
    this.state = {
      menu: false,
      showHeader: false,
      transparent: true,
      title: '',
      progress: 0,
      enableHideHeader: true
    };
    if (typeof window !== 'undefined') {
      this.smoothScroll = window.smoothScroll;
    }
    this.lastScrollTop = 0;
    this._handleScroll = throttle(this.handleScroll, 200);
  }

  componentDidMount() {
    events.on(window.document, 'scroll', this._handleScroll);
    this.handleScroll({ target: window.document.body });
  }

  componentWillUnmount() {
    events.off(window.document, 'scroll', this._handleScroll);
    this.smoothScroll.destroy();
  }

  // 滚动事件
  handleScroll = (e) => {
    const scrollTop = domQuery.scrollTop(e.target);
    const scrollHeight = window.document.documentElement.scrollHeight || window.document.body.scrollHeight;
    const height = window.innerHeight;
    const { transparent, progress } = this.state;
    const scrollDirection = scrollTop > this.lastScrollTop;
    const scrollDistance = Math.abs(scrollTop - this.lastScrollTop);
    const contentToTop =
      get(document.querySelector('.post'), 'offsetTop', 0) + get(document.querySelector('.separator'), 'offsetTop', 0);
    const state = {};

    this.lastScrollTop = scrollTop;

    if (scrollTop >= contentToTop) {
      // if (scrollDirection && scrollDistance >= 20 && this.state.showHeader) {
      //   // 向下滚动，隐藏 header
      //   state.showHeader = false;
      // }

      // if (!scrollDirection && scrollDistance >= 20 && !this.state.showHeader) {
      //   // 向上滚动，显示 header
      //   state.showHeader = true;
      // }

      if (transparent) {
        state.transparent = false;
      }

      state.progress = (((scrollTop - contentToTop) / (scrollHeight - contentToTop - height)) * 100).toFixed(0);
    }

    if (scrollTop <= contentToTop) {
      state.enableHideHeader = true;
      state.showHeader = false;
      if (!transparent) {
        state.transparent = true;
      }

      if (progress) {
        state.progress = 0;
      }
    }

    if (!isEmptyObject(state)) this.setState(state);
  };

  // 切换 菜单栏显隐
  toggleMenu = (menu) => {
    if (!menu) {
      window.document.documentElement.classList.add('disabled');
    } else {
      window.document.documentElement.classList.remove('disabled');
    }

    this.setState({
      menu: !menu
    });
  };

  scrollTo = (hash) => {
    if (!hash) {
      this.smoothScroll.animateScroll(window.document.querySelector('title'), null, {
        offset: 0,
        easing: 'easeInOutCubic'
      });

      return;
    }
    const value = hash[0] === '#' ? hash.slice(1) : hash;
    this.smoothScroll.animateScroll(window.document.querySelector(`[id='${value}']`), null, {
      offset: 50,
      easing: 'easeInOutCubic'
    });
  };

  enableHideHeader = (enable) => {
    this.setState({
      enableHideHeader: enable,
      showHeader: false
    });
  };

  openLink = () => {
    this.toggleMenu(true);
  };

  render() {
    const { menu, showHeader, enableHideHeader, transparent, progress } = this.state;
    let { data, children } = this.props;
    let { description, title } = data.site.siteMetadata;
    var isVisibleHeader = showHeader || !enableHideHeader;

    return (
      <div>
        <Helmet titleTemplate={`%s - ${title}`} defaultTitle={title}>
          <meta name='description' content={description} />
          <html lang='zh-cn' /> {/* this is valid react-helmet usage! */}
          <meta charSet='utf-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta httpEquiv='X-UA-Compatible' content='IE=edge,chrome=1' />
          <meta name='HandheldFriendly' content='True' />
        </Helmet>
        <div className={cx({ 'fixed-header': true, show: isVisibleHeader })}>
          <p onClick={() => this.scrollTo()}>{title}</p>
          <div onClick={() => this.toggleMenu(isVisibleHeader && menu)}>
            <Icon type={isVisibleHeader && menu ? 'cross' : 'menu'} />
          </div>
        </div>
        <Menu isProduction={this.isProduction} />
        <div
          className={cx({
            'header-menu': true,
            active: isVisibleHeader && menu
          })}
        >
          <div className='menu-list'>
            <li className='menu-item' onClick={() => this.openLink()}>
              <GatsbyLink exact to='/'>
                首页
              </GatsbyLink>
            </li>
            <li className='menu-item' onClick={() => this.openLink()}>
              <GatsbyLink exact to='/tags'>
                标签
              </GatsbyLink>
            </li>
            <li className='menu-item' onClick={() => this.openLink()}>
              <GatsbyLink exact to='/about'>
                关于
              </GatsbyLink>
            </li>
            <li className='menu-item' onClick={() => this.openLink()}>
              <GatsbyLink exact to='/search'>
                搜索
              </GatsbyLink>
            </li>
            {!this.isProduction ? (
              <li className='menu-item' onClick={() => this.openLink()}>
                <GatsbyLink exact to='/drafts'>
                  草稿
                </GatsbyLink>
              </li>
            ) : null}
          </div>
        </div>
        <section className='main-content'>
          {children({
            ...this.props,
            scrollTo: this.scrollTo,
            enableHideHeader: this.enableHideHeader,
            setTitle: this.setTitle
          })}
        </section>
        {
          enableHideHeader && <Footer />
        }
        <div className={cx({ totop: true, show: !transparent })} onClick={() => this.scrollTo()}>
          <Icon type='arrow-up' />
          <span className='progress'>{progress}%</span>
          <div className='bg' style={{ height: `${progress}%` }} />
        </div>
      </div>
    );
  }
}

IndexLayout.propTypes = {
  children: PropTypes.func,
  data: PropTypes.object
};

export const pageQuery = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`;
