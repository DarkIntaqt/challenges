import 'core-js/es/promise'

if (window.fetch) {
    import('./App').then(module => module.default())
} else {
    import('./polyfills').then(() => {
        import('./App').then(module => module.default())
    })
}