module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  //配置Vant
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant']
  ]
}
