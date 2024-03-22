import icons from '../lib/floatcons/icons';

const content = {
    landingCopy: 'Click to continue...',
    backgroundImages: ['2.png', '3.png', '4.png', '5.png', 'base.png'],
    floatcons: {
        header: 'The Kalem Stack',
        bodyFirst:
            'I have spent years curating a personal stack of technology. This is my toolbelt, and with it I feel ',
        bodyItalic: 'fast',
        bodyLast: '. The bigger the icon, the more I depend on it!',
        wrangle: 'Wrangle',
        release: 'Release',
        customIcons: icons
    },
    footer: {
        body: "My brain is hard-wired to solve problems. I have yet to find one that cannot be solved with a plan of attack and a passion to learn. I honestly cannot get enough. Let's connect!",
        buttons: [
            { name: 'Github', url: 'https://github.com/kalem-edlin' },
            {
                name: 'Linkedin',
                url: 'https://www.linkedin.com/in/kalemedlin/'
            },
            { name: 'Contact', url: 'mailto:kalemedlin@gmail.com' }
        ]
    }
};

const personal = {
    landingCopy: 'Click to start the experience...',
    backgroundImages: [
        'https://res.cloudinary.com/dcjkohps6/image/upload/v1711131031/Screenshot_2024-03-22_at_1.09.55_PM_s6b3pl.png',
        'https://s.yimg.com/ny/api/res/1.2/FlsOcvFlIJ4I34an2mjLqw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTQyNg--/https://media.zenfs.com/en/hypebeast_936/d45ea0c1513c5ec7ec58bc6c224a89d6',
        'https://www.setdecorators.org/sites/setdecorators/articles/WHIPLASH_8_410.jpg',
        '5.png',
        'base.png'
    ],
    floatcons: {
        header: 'The Kalem Stack',
        bodyFirst:
            'I have spent years curating a personal stack of technology. This is my toolbelt, and with it I feel ',
        bodyItalic: 'fast',
        bodyLast: '. The bigger the icon, the more I depend on it!',
        wrangle: 'Wrangle',
        release: 'Release',
        customIcons: icons
    },
    footer: {
        body: "My brain is hard-wired to solve problems. I have yet to find one that cannot be solved with a plan of attack and a passion to learn. I honestly cannot get enough. Let's connect!",
        buttons: [
            { name: 'Github', url: 'https://github.com/kalem-edlin' },
            {
                name: 'Linkedin',
                url: 'https://www.linkedin.com/in/kalemedlin/'
            },
            { name: 'Contact', url: 'mailto:kalemedlin@gmail.com' }
        ]
    }
};

export type Content = typeof content;

export default content;
