export const setThemeColor = (color: string) => {
  let themeColorMetaTag = document.querySelector('meta[name="theme-color"]');

  if (!themeColorMetaTag) {
    themeColorMetaTag = document.createElement('meta');
    themeColorMetaTag.setAttribute('name', 'theme-color');
    document.head.appendChild(themeColorMetaTag);
  }

  themeColorMetaTag.setAttribute('content', color);
};
