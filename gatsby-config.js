require('dotenv').config();

const query = `{
    allMarkdownRemark(filter: { frontmatter: { draft: { ne: true } } }){
      edges {
        node {
          excerpt(pruneLength: 250)
          frontmatter {
            date(formatString: "YYYY-MM-DD HH:mm:ss")
            title
            tags
            path
          }
        }
      }
    }
  }`;

const queries = [
  {
    query,
    transformer: ({ data }) =>
      data.allMarkdownRemark.edges.map(({ node }) => {
        node.objectID = node.frontmatter.path;
        return node;
      })
  }
];

module.exports = {
  pathPrefix: '/',
  siteMetadata: {
    author: '女王控',
    title: `女王控的博客`,
    siteUrl: `https://blog.towavephone.com`,
    description: `前端工程师，黑猫女王控，欢迎勾搭，技术相关<a href="https://github.com/towavephone" target="_blank">@towavephone</a>，QQ闲聊<a href="tencent://AddContact/?fromId=45&fromSubId=1&subcmd=all&uin=634407147&website=www.oicqzone.com">@towave</a>，bili关注<a href="https://space.bilibili.com/11507708#/" target="_blank">@towave</a>`,
    algolia: {
      appId: process.env.ALGOLIA_APP_ID ? process.env.ALGOLIA_APP_ID : '',
      searchOnlyApiKey: process.env.ALGOLIA_SEARCH_ONLY_API_KEY ? process.env.ALGOLIA_SEARCH_ONLY_API_KEY : '',
      indexName: process.env.ALGOLIA_INDEX_NAME ? process.env.ALGOLIA_INDEX_NAME : ''
    }
  },
  plugins: [
    'gatsby-plugin-catch-links',
    'gatsby-plugin-sass',
    {
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.ALGOLIA_APP_ID ? process.env.ALGOLIA_APP_ID : '',
        apiKey: process.env.ALGOLIA_ADMIN_API_KEY ? process.env.ALGOLIA_ADMIN_API_KEY : '',
        indexName: process.env.ALGOLIA_INDEX_NAME ? process.env.ALGOLIA_INDEX_NAME : '',
        queries,
        chunkSize: 10000 // default: 1000
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/blog`,
        name: 'blog'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/static/images`,
        name: 'images'
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        excerpt_separator: `<!-- more -->`,
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 800,
              backgroundColor: '#fafafa'
            }
          },
          {
            resolve: 'gatsby-remark-graph',
            options: {
              // this is the language in your code-block that triggers mermaid parsing
              language: 'mermaid', // default
              theme: 'default' // could also be dark, forest, or neutral
            }
          },
          'gatsby-remark-static-images',
          'gatsby-remark-copy-linked-files',
          `gatsby-remark-autolink-headers`,
          `gatsby-remark-emoji`,
          `gatsby-remark-katex`,
          `gatsby-remark-smartypants`,
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 2em`
            }
          },
          {
            resolve: `gatsby-remark-design-system-towavephone`,
            options: {
              // Class prefix for all elements of the design system specimens
              // This prefix also needs to be set on wrapper components in your Gatsby project
              // Default value is 'grds' - so if you want you can leave out this option entirely
              classPrefix: `grds`
            }
          },
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_blank',
              rel: 'nofollow noreferrer noopener'
            }
          },
          {
            resolve: 'gatsby-remark-embed-snippet',
            options: {
              // Class prefix for <pre> tags containing syntax highlighting;
              // defaults to 'language-' (eg <pre class="language-js">).
              // If your site loads Prism into the browser at runtime,
              // (eg for use with libraries like react-live),
              // you may use this to prevent Prism from re-processing syntax.
              // This is an uncommon use-case though;
              // If you're unsure, it's best to use the default value.
              classPrefix: 'language-',

              // Example code links are relative to this dir.
              // eg examples/path/to/file.js
              directory: `${__dirname}/static/examples/`
            }
          },
          {
            resolve: `gatsby-remark-code-buttons-towavephone`,
            options: {
              buttonText: '复制代码',
              toasterText: '复制成功'
            }
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: 'language-',
              showLineNumbers: true
            }
          },
          {
            resolve: 'gatsby-remark-embedded-codesandbox-towavephone',
            options: {
              maxRequestRetryCount: 3,
              maxRequestCount: 10,
              isLoggingRequest: true,
              // Required:

              // Example code folders are relative to this dir.
              // eg src/_examples/some-example-folder
              directory: `${__dirname}/static/examples/`,

              // Optional:

              // Custom protocol for parsing the embedding link
              protocol: 'embedded-codesandbox://',

              // Customise CodeSandbox embedding options:
              // https://codesandbox.io/docs/embedding#embed-options
              embedOptions: {
                view: 'split',
                hidenavigation: 1,
                theme: 'light',
                codemirror: 1
              },

              // Customise the embedding iframe given the generated url
              // default:
              getIframe: (url) =>
                `<iframe src="${url}" class="embedded-codesandbox" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin allow-downloads"></iframe>`,

              // Customise the ignored file / folder names
              // default:
              ignoredFiles: ['node_modules', 'yarn.lock', 'package-lock.json'],

              // 静态资源替换网址
              siteUrl: `https://blog.towavephone.com`,
              // 占位符正则式，识别后替换
              gatsbyPublicDirRegex: /\/GATSBY_PUBLIC_DIR/g
            }
          },
          `gatsby-remark-lazy-load-towavephone`
        ]
      }
    },
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: '黑猫女王控',
        short_name: '女王控',
        start_url: '/',
        theme_color: '#fafafa',
        display: 'minimal-ui',
        icons: [
          {
            src: `/favicons/android-chrome-192x192.png`,
            sizes: `192x192`,
            type: `image/png`
          },
          {
            src: `/favicons/android-chrome-512x512.png`,
            sizes: `512x512`,
            type: `image/png`
          },
          {
            src: `/favicon/apple-touch-icon-180x180.png`,
            sizes: `180x180`,
            type: `image/png`
          },
          {
            src: `/favicon/favicon-96x96.png`,
            sizes: `96x96`,
            type: `image/png`
          }
        ]
      }
    },
    {
      resolve: `gatsby-plugin-sitemap`
    },
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://blog.towavephone.com`
      }
    },
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        color: `tomato`
      }
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
        {
          site {
            siteMetadata {
              title
              description
              siteUrl
            }
          }
        }
      `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges
                .filter((post) => !post.node.frontmatter.draft)
                .map((edge) => {
                  return Object.assign({}, edge.node.frontmatter, {
                    description: edge.node.excerpt,
                    url: site.siteMetadata.siteUrl + edge.node.frontmatter.path,
                    guid: site.siteMetadata.siteUrl + edge.node.frontmatter.path,
                    custom_elements: [{ 'content:encoded': edge.node.html }]
                  });
                });
            },
            setup: ({
              query: {
                site: { siteMetadata }
              }
            }) => {
              return {
                title: siteMetadata.title,
                description: siteMetadata.description,
                feed_url: siteMetadata.siteUrl + `/rss.xml`,
                site_url: siteMetadata.siteUrl,
                generator: `GatsbyJS`
              };
            },
            query: `
            {
              allMarkdownRemark(
                limit: 1000,
                sort: { order: DESC, fields: [frontmatter___date] }
              ) {
                edges {
                  node {
                    excerpt
                    html
                    frontmatter {
                      title
                      date
                      path
                      draft
                    }
                  }
                }
              }
            }
          `,
            output: '/rss.xml'
          }
        ]
      }
    },
    'gatsby-plugin-offline'
  ]
};
