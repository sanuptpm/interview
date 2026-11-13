// node scripts/gaps_react_ts/audit.mjs
// Checklist of commonly asked React / TypeScript items. An item is covered only
// if a question TITLE matches its pattern (a mention inside an answer does not count).
// Reads titles from scripts/topics/titles_<page>.json (run scripts/topics/dump.py first).
import { readFileSync } from 'node:fs'
const dir = new URL('.', import.meta.url).pathname

const CHECK = {
  react: [
    // hooks
    ['useState', /useState/], ['useReducer', /useReducer/], ['useContext', /useContext/],
    ['useRef', /useRef/], ['useImperativeHandle', /useImperativeHandle/], ['useEffect', /useEffect/],
    ['useLayoutEffect', /useLayoutEffect/], ['useInsertionEffect', /useInsertionEffect/],
    ['useMemo', /useMemo/], ['useCallback', /useCallback/], ['useTransition', /useTransition/],
    ['useDeferredValue', /useDeferredValue/], ['useId', /useId/], ['useDebugValue', /useDebugValue/],
    ['useSyncExternalStore', /useSyncExternalStore/], ['useActionState', /useActionState/],
    ['useOptimistic', /useOptimistic/], ['use()', /\buse\(\)/], ['useFormStatus', /useFormStatus/],
    ['useEffectEvent', /useEffectEvent/],
    // APIs
    ['createContext', /createContext|Context API/], ['memo', /React\.memo/], ['forwardRef', /forwardRef/],
    ['lazy', /React\.lazy/], ['Suspense', /Suspense/], ['Fragment', /Fragment/], ['StrictMode', /StrictMode/],
    ['Profiler', /Profiler/], ['createPortal', /portal/i], ['flushSync', /flushSync/],
    ['startTransition', /\bstartTransition/], ['Children/cloneElement/isValidElement', /cloneElement|Children\b/],
    ['createRoot/hydrateRoot', /createRoot|hydrateRoot/], ['key', /\bkeys?\b/], ['ref callbacks', /ref callback|callback ref/i],
    ['dangerouslySetInnerHTML', /dangerouslySetInnerHTML/], ['defaultValue/defaultChecked', /defaultValue|defaultChecked/],
    ['synthetic events', /SyntheticEvent/], ['React DevTools', /DevTools/],
    // concepts
    ['virtual DOM', /Virtual DOM/i], ['reconciliation', /reconciliation/i], ['fiber', /Fiber/],
    ['batching', /batching/i], ['controlled/uncontrolled', /uncontrolled/i], ['lifting state', /lifting state/i],
    ['prop drilling', /prop drilling/i], ['HOC', /HOC|higher-order/i], ['render props', /render props/i],
    ['compound components', /compound components/i], ['error boundaries', /error boundar/i],
    ['code splitting', /code splitting|lazy loading/i], ['SSR/CSR/SSG', /SSR/], ['hydration', /hydrat/i],
    ['server components', /Server Components/i], ['pure components', /pure component|PureComponent/i],
    ['immutability', /immutab/i], ['memo vs useMemo', /memo vs useMemo|useMemo vs (React\.)?memo/i],
  ],
  typescript: [
    ['type', /type alias/], ['interface', /interface/], ['enum', /enum/], ['namespace', /namespace/],
    ['declare', /\bdeclare\b/], ['abstract', /abstract/], ['implements', /implements/], ['extends', /extends/],
    ['keyof', /keyof/], ['typeof', /typeof/], ['in', /\bin\b.*instanceof|mapped/], ['as', /\(as\)|\bas\b const/],
    ['satisfies', /satisfies/], ['is', /\bis Type/], ['asserts', /asserts/], ['infer', /infer/],
    ['readonly', /readonly/i], ['unique symbol', /unique symbol/], ['never', /never/], ['unknown', /unknown/],
    ['any', /\bany\b/], ['void', /void/], ['object / {}', /object.*\{\}|\{\}.*object/],
    ['Partial', /Partial/], ['Required', /Required/], ['Readonly', /Readonly/], ['Record', /Record/],
    ['Pick', /Pick/], ['Omit', /Omit/], ['Exclude', /Exclude/], ['Extract', /Extract/], ['NonNullable', /NonNullable/],
    ['Parameters', /\bParameters/], ['ConstructorParameters', /ConstructorParameters/], ['ReturnType', /ReturnType/],
    ['InstanceType', /InstanceType/], ['Awaited', /Awaited/], ['NoInfer', /NoInfer/], ['ThisType', /ThisType/],
    ['Uppercase/Lowercase/Capitalize/Uncapitalize', /Uppercase|Capitalize/],
    ['strict', /strict/], ['noImplicitAny', /noImplicitAny/], ['strictNullChecks', /strictNullChecks/],
    ['esModuleInterop', /esModuleInterop/], ['target/module', /target, module/], ['paths/baseUrl', /\bpaths\b|baseUrl/],
    ['skipLibCheck', /skipLibCheck/], ['React.FC vs function', /\bFC\b/], ['ReactNode vs JSX.Element', /ReactNode/],
    ['ComponentProps', /ComponentProps/], ['React event types', /event handlers in React/],
    ['generic components', /generic React component/],
  ],
}

for (const [page, items] of Object.entries(CHECK)) {
  const titles = JSON.parse(readFileSync(`${dir}../topics/titles_${page}.json`, 'utf8')).map((t) => t.title)
  const missing = items.filter(([, re]) => !titles.some((t) => re.test(t)))
  console.log(`${page}: ${items.length} items, ${titles.length} titles, missing ${missing.length}`)
  missing.forEach(([name]) => console.log('  - ' + name))
}
