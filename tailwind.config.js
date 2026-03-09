module.exports = {
  darkMode: ["selector", '[zaui-theme="dark"]'],
  purge: {
    enabled: true,
    content: ["./src/**/*.{js,jsx,ts,tsx,vue}"],
  },
  theme: {
    extend: {
      colors: {
        primary: '#283b91',
        secondary: '#d32829',
        accent: '#d32829',
        background: '#FFFFFF',
      },
      fontFamily: {
        mono: ["Roboto Mono", "monospace"],
      },
    },
  },
};
