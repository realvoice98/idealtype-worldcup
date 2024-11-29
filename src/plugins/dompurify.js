import DOMPurify from 'dompurify';

export default {
    install(app) {
        app.config.globalProperties.$sanitize = (html) => DOMPurify.sanitize(html);
    }
};
