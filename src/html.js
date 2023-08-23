/* eslint  react/prop-types: 0 */
import React from 'react';

export default class HTML extends React.Component {
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
