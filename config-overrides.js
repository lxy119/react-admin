const { override, fixBabelImports,addLessLoader } = require('customize-cra');
module.exports = override(
       //根据import来按需打包
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
       }),
    addLessLoader({
        lessOptions:{
         javascriptEnabled: true,
         modifyVars: { '@primary-color': 'green' },
        }    
    }),
 );
