const fs = require('fs');
const path = require('path');

function WebViewFixPlugin(pluginOptions) {
  // 使用配置（options）设置插件实例
  this.options = pluginOptions;
}

function replacePath(resolvePath) {
  const filePath = path.join(`${resolvePath}/index.html`);
  const fileStr = fs.readFileSync(filePath, 'utf-8');
  let resultStr = fileStr
    .replace(/(https:)?\/\/static\.superboss\.cc/g, 'https://webview/static')
    .replace(/(https:)?\/\/static2\.superboss\.cc/g, 'https://webview/static2')
    .replace(
      /(https:)?\/\/staticnew\.superboss\.cc/g,
      'https://webview/staticnew',
    )
    .replace(
      /<\/head>/g,
      `
    <script>window.WEBVIEW_API_ROOT="https://vt.superboss.cc"</script>
    <script src="https://appx/web-view.min.js" type="text/javascript"></script>
    <script src="https://webview/staticnew/xhrHook.js" type="text/javascript"></script>
    <script src="https://webview/staticnew/common-webview.js" type="text/javascript"></script>
    <script src="https://webview/staticnew/webview.js" type="text/javascript"></script>
    </head>`,
    );
  fs.writeFileSync(filePath, resultStr, 'utf-8');
}

WebViewFixPlugin.prototype.apply = function(compiler) {
  compiler.plugin('done', () => {
    replacePath(arguments[0].outputPath);
  });
};

module.exports = WebViewFixPlugin;
