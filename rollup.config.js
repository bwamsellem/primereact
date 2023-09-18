import alias from '@rollup/plugin-alias';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';

import fs from 'fs-extra';
import path from 'path';

import pkg from './package.json';

let entries = [];

let core = {};

// alias entries
const ALIAS_ICON_COMPONENT_ENTRIES = [
    { find: '../../iconbase/IconBase', replacement: 'primereact-rl/iconbase' },
    { find: '../icons/angledoubledown', replacement: 'primereact-rl/icons/angledoubledown' },
    { find: '../icons/angledoubleleft', replacement: 'primereact-rl/icons/angledoubleleft' },
    { find: '../icons/angledoubleright', replacement: 'primereact-rl/icons/angledoubleright' },
    { find: '../icons/angledoubleup', replacement: 'primereact-rl/icons/angledoubleup' },
    { find: '../icons/angledown', replacement: 'primereact-rl/icons/angledown' },
    { find: '../icons/angleleft', replacement: 'primereact-rl/icons/angleleft' },
    { find: '../icons/angleright', replacement: 'primereact-rl/icons/angleright' },
    { find: '../icons/angleup', replacement: 'primereact-rl/icons/angleup' },
    { find: '../icons/arrowdown', replacement: 'primereact-rl/icons/arrowdown' },
    { find: '../icons/arrowup', replacement: 'primereact-rl/icons/arrowup' },
    { find: '../icons/ban', replacement: 'primereact-rl/icons/ban' },
    { find: '../icons/bars', replacement: 'primereact-rl/icons/bars' },
    { find: '../icons/calendar', replacement: 'primereact-rl/icons/calendar' },
    { find: '../icons/check', replacement: 'primereact-rl/icons/check' },
    { find: '../icons/chevrondown', replacement: 'primereact-rl/icons/chevrondown' },
    { find: '../icons/chevronleft', replacement: 'primereact-rl/icons/chevronleft' },
    { find: '../icons/chevronright', replacement: 'primereact-rl/icons/chevronright' },
    { find: '../icons/chevronup', replacement: 'primereact-rl/icons/chevronup' },
    { find: '../icons/exclamationtriangle', replacement: 'primereact-rl/icons/exclamationtriangle' },
    { find: '../icons/eye', replacement: 'primereact-rl/icons/eye' },
    { find: '../icons/eyeslash', replacement: 'primereact-rl/icons/eyeslash' },
    { find: '../icons/filter', replacement: 'primereact-rl/icons/filter' },
    { find: '../icons/filterslash', replacement: 'primereact-rl/icons/filterslash' },
    { find: '../icons/infocircle', replacement: 'primereact-rl/icons/infocircle' },
    { find: '../icons/minus', replacement: 'primereact-rl/icons/minus' },
    { find: '../icons/pencil', replacement: 'primereact-rl/icons/pencil' },
    { find: '../icons/plus', replacement: 'primereact-rl/icons/plus' },
    { find: '../icons/refresh', replacement: 'primereact-rl/icons/refresh' },
    { find: '../icons/search', replacement: 'primereact-rl/icons/search' },
    { find: '../icons/searchminus', replacement: 'primereact-rl/icons/searchminus' },
    { find: '../icons/searchplus', replacement: 'primereact-rl/icons/searchplus' },
    { find: '../icons/sortalt', replacement: 'primereact-rl/icons/sortalt' },
    { find: '../icons/sortamountdown', replacement: 'primereact-rl/icons/sortamountdown' },
    { find: '../icons/sortamountupalt', replacement: 'primereact-rl/icons/sortamountupalt' },
    { find: '../icons/spinner', replacement: 'primereact-rl/icons/spinner' },
    { find: '../icons/star', replacement: 'primereact-rl/icons/star' },
    { find: '../icons/starfill', replacement: 'primereact-rl/icons/starfill' },
    { find: '../icons/thlarge', replacement: 'primereact-rl/icons/thlarge' },
    { find: '../icons/times', replacement: 'primereact-rl/icons/times' },
    { find: '../icons/timescircle', replacement: 'primereact-rl/icons/timescircle' },
    { find: '../icons/trash', replacement: 'primereact-rl/icons/trash' },
    { find: '../icons/undo', replacement: 'primereact-rl/icons/undo' },
    { find: '../icons/upload', replacement: 'primereact-rl/icons/upload' },
    { find: '../icons/windowmaximize', replacement: 'primereact-rl/icons/windowmaximize' },
    { find: '../icons/windowminimize', replacement: 'primereact-rl/icons/windowminimize' }
];

const ALIAS_COMPONENT_ENTRIES = [
    { find: '../utils/Utils', replacement: 'primereact-rl/utils' },
    { find: '../api/Api', replacement: 'primereact-rl/api' },
    { find: '../componentbase/ComponentBase', replacement: 'primereact-rl/componentbase' },
    { find: '../hooks/Hooks', replacement: 'primereact-rl/hooks' },
    { find: '../ripple/Ripple', replacement: 'primereact-rl/ripple' },
    { find: '../csstransition/CSSTransition', replacement: 'primereact-rl/csstransition' },
    { find: '../portal/Portal', replacement: 'primereact-rl/portal' },
    { find: '../keyfilter/KeyFilter', replacement: 'primereact-rl/keyfilter' },
    ...ALIAS_ICON_COMPONENT_ENTRIES,
    { find: '../tooltip/Tooltip', replacement: 'primereact-rl/tooltip' },
    { find: '../virtualscroller/VirtualScroller', replacement: 'primereact-rl/virtualscroller' },
    { find: '../terminalservice/TerminalService', replacement: 'primereact-rl/terminalservice' },
    { find: '../overlayservice/OverlayService', replacement: 'primereact-rl/overlayservice' },
    { find: '../checkox/Checkbox', replacement: 'primereact-rl/checkbox' },
    { find: '../button/Button', replacement: 'primereact-rl/button' },
    { find: '../inputtext/InputText', replacement: 'primereact-rl/inputtext' },
    { find: '../inputnumber/InputNumber', replacement: 'primereact-rl/inputnumber' },
    { find: '../messages/Messages', replacement: 'primereact-rl/messages' },
    { find: '../progressbar/ProgressBar', replacement: 'primereact-rl/progressbar' },
    { find: '../dropdown/Dropdown', replacement: 'primereact-rl/dropdown' },
    { find: '../dialog/Dialog', replacement: 'primereact-rl/dialog' },
    { find: '../paginator/Paginator', replacement: 'primereact-rl/paginator' },
    { find: '../tree/Tree', replacement: 'primereact-rl/tree' }
];

// dependencies
const GLOBAL_DEPENDENCIES = {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-transition-group': 'ReactTransitionGroup'
};

const GLOBAL_COMPONENT_DEPENDENCIES = {
    ...GLOBAL_DEPENDENCIES,
    ...ALIAS_COMPONENT_ENTRIES.reduce((acc, cur) => ({ ...acc, [cur.replacement]: cur.replacement.replaceAll('/', '.') }), {})
};

// externals
const EXTERNAL = ['react', 'react-dom', 'react-transition-group', '@babel/runtime', '@fullcalendar/core', 'chart.js/auto', 'quill'];

const EXTERNAL_COMPONENT = [...EXTERNAL, ...ALIAS_COMPONENT_ENTRIES.map((entries) => entries.replacement)];

// plugins
const BABEL_PLUGIN_OPTIONS = {
    exclude: 'node_modules/**',
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-class-properties'],
    skipPreflightCheck: true,
    babelHelpers: 'runtime',
    babelrc: false
};

const ALIAS_PLUGIN_OPTIONS_FOR_COMPONENT = {
    entries: ALIAS_COMPONENT_ENTRIES
};

const REPLACE_PLUGIN_OPTIONS = {
    'process.env.NODE_ENV': JSON.stringify('production'),
    preventAssignment: true
};

const RESOLVE_PLUGIN_OPTIONS = {
    extensions: ['.js']
};

const COMMONJS_PLUGIN_OPTIONS = {
    exclude: process.env.INPUT_DIR + '**',
    sourceMap: false
};

const POSTCSS_PLUGIN_OPTIONS = {
    sourceMap: false
};

const TERSER_PLUGIN_OPTIONS = {
    compress: {
        keep_infinity: true,
        pure_getters: true,
        reduce_funcs: false
    }
};

const PLUGINS = [replace(REPLACE_PLUGIN_OPTIONS), resolve(RESOLVE_PLUGIN_OPTIONS), commonjs(COMMONJS_PLUGIN_OPTIONS), babel(BABEL_PLUGIN_OPTIONS), postcss(POSTCSS_PLUGIN_OPTIONS)];

const PLUGINS_COMPONENT = [alias(ALIAS_PLUGIN_OPTIONS_FOR_COMPONENT), ...PLUGINS];

function addEntry(name, input, output, isComponent = true) {
    const exports = name === 'primereact.api' || name === 'primereact' ? 'named' : 'auto';
    const useCorePlugin = ALIAS_COMPONENT_ENTRIES.some((entry) => entry.replacement === name.replaceAll('.', '/'));
    const plugins = isComponent ? PLUGINS_COMPONENT : PLUGINS;
    const external = isComponent ? EXTERNAL_COMPONENT : EXTERNAL;
    const inlineDynamicImports = true;

    const getEntry = (isMinify) => {
        return {
            input,
            plugins: [...plugins, isMinify && terser(TERSER_PLUGIN_OPTIONS), useCorePlugin && corePlugin()],
            external,
            inlineDynamicImports
        };
    };

    const get_CJS_ESM = (isMinify) => {
        return {
            ...getEntry(isMinify),
            output: [
                {
                    format: 'cjs',
                    file: `${output}.cjs${isMinify ? '.min' : ''}.js`,
                    exports
                },
                {
                    format: 'esm',
                    file: `${output}.esm${isMinify ? '.min' : ''}.js`,
                    exports
                }
            ]
        };
    };

    const get_IIFE = (isMinify) => {
        return {
            ...getEntry(isMinify),
            output: [
                {
                    format: 'iife',
                    name,
                    file: `${output}${isMinify ? '.min' : ''}.js`,
                    globals: isComponent ? GLOBAL_COMPONENT_DEPENDENCIES : GLOBAL_DEPENDENCIES,
                    exports
                }
            ]
        };
    };

    entries.push(get_CJS_ESM());
    entries.push(get_IIFE());

    // Minify
    entries.push(get_CJS_ESM(true));
    entries.push(get_IIFE(true));
}

function corePlugin() {
    return {
        name: 'corePlugin',
        generateBundle(outputOptions, bundle) {
            const { name, format } = outputOptions;

            if (format === 'iife') {
                Object.keys(bundle).forEach((id) => {
                    const chunk = bundle[id];
                    const folderName = name.replace('primereact.', '').replaceAll('.', '/');
                    const filePath = `./dist/core/core${id.indexOf('.min.js') > 0 ? '.min.js' : '.js'}`;

                    core[filePath] ? (core[filePath][folderName] = chunk.code) : (core[filePath] = { [`${folderName}`]: chunk.code });
                });
            }
        }
    };
}

function addCore() {
    const lastEntry = entries[entries.length - 1];

    lastEntry.plugins = [
        ...lastEntry.plugins,
        {
            name: 'coreMergePlugin',
            generateBundle() {
                Object.entries(core).forEach(([filePath, value]) => {
                    const code = ALIAS_COMPONENT_ENTRIES.reduce((val, entry) => {
                        const name = entry.replacement.replace('primereact-rl/', '');

                        val += value[name] + '\n';

                        return val;
                    }, '');

                    fs.outputFile(path.resolve(__dirname, filePath), code, {}, function (err) {
                        if (err) {
                            // eslint-disable-next-line no-console
                            return console.error(err);
                        }
                    });
                });
            }
        }
    ];
}

function addComponent() {
    fs.readdirSync(path.resolve(__dirname, process.env.INPUT_DIR), { withFileTypes: true })
        .filter((dir) => dir.isDirectory())
        .forEach(({ name: folderName }) => {
            fs.readdirSync(path.resolve(__dirname, process.env.INPUT_DIR + folderName)).forEach((file) => {
                const name = file.split(/(.js)$/)[0].toLowerCase();

                if (name === folderName) {
                    const input = process.env.INPUT_DIR + folderName + '/' + file;
                    const output = process.env.OUTPUT_DIR + folderName + '/' + name;

                    addEntry('primereact.' + folderName, input, output, true);
                }
            });
        });
}

function addIcon() {
    const iconDir = path.resolve(__dirname, process.env.INPUT_DIR + 'icons');

    fs.readdirSync(path.resolve(__dirname, iconDir), { withFileTypes: true })
        .filter((dir) => dir.isDirectory())
        .forEach(({ name: folderName }) => {
            fs.readdirSync(path.resolve(__dirname, iconDir + '/' + folderName)).forEach((file) => {
                if (/\.js$/.test(file)) {
                    const name = file.split(/(.js)$/)[0].toLowerCase();
                    const input = process.env.INPUT_DIR + 'icons/' + folderName + '/' + file;
                    const output = process.env.OUTPUT_DIR + 'icons/' + folderName + '/' + name;

                    addEntry('primereact.icons.' + folderName, input, output, true);
                }
            });
        });
}

function addPrimeReact() {
    const input = process.env.INPUT_DIR + 'primereact.all.js';
    const output = process.env.OUTPUT_DIR + 'primereact.all';

    addEntry('primereact', input, output, false);
}

function addPackageJson() {
    const outputDir = path.resolve(__dirname, process.env.OUTPUT_DIR);
    const packageJson = `{
    "name": "primereact-rl",
    "version": "${pkg.version}",
    "private": false,
    "author": "PrimeTek Informatics",
    "description": "PrimeReact is an open source UI library for React featuring a rich set of 90+ components, a theme designer, various theme alternatives such as Material, Bootstrap, Tailwind, premium templates and professional support. In addition, it integrates with PrimeBlock, which has 370+ ready to use UI blocks to build spectacular applications in no time.",
    "homepage": "https://www.primereact.org",
    "repository": {
        "type": "git",
        "url": "https://github.com/primefaces/primereact.git"
    },
    "license": "MIT",
    "bugs": {
        "url": "https://github.com/primefaces/primereact/issues"
    },
    "keywords": [
        "primereact",
        "react",
        "hooks",
        "next",
        "nextjs",
        "ui-kit",
        "ui library",
        "component library",
        "material",
        "material design",
        "bootstrap",
        "tailwind theme",
        "dark theme",
        "react components",
        "responsive components"
    ],
    "unpkg": "primereact.all.min.js",
    "jsdelivr": "primereact.all.min.js",
    "main": "primereact.all.min.js",
    "module": "primereact.all.esm.min.js",
    "web-types": "web-types.json",
    "peerDependencies": {
        "@types/react": "^17.0.0 || ^18.0.0",
        "react": "^17.0.0 || ^18.0.0",
        "react-dom": "^17.0.0 || ^18.0.0"
    },
    "peerDependenciesMeta": {
        "@types/react": {
            "optional": true
        }
    },
    "dependencies": {
        "@types/react-transition-group": "^4.4.1",
        "react-transition-group": "^4.4.1"
    },
    "sideEffects": [
        "**/*.css"
    ]
}`;

    !fs.existsSync(outputDir) && fs.mkdirSync(outputDir);
    fs.writeFileSync(path.resolve(outputDir, 'package.json'), packageJson);
}

addIcon();
addComponent();
addPrimeReact();
addCore();
addPackageJson();

export default entries;
