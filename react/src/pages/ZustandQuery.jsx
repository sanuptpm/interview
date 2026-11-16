import { QueryClient, QueryClientProvider, useIsFetching } from '@tanstack/react-query'
import { useFilterStore } from './zustandQuery/useFilterStore'
import PostList from './zustandQuery/PostList'

const queryClient = new QueryClient()

// Shows the data behind the screen: the Zustand store and the query status.
function StateView() {
  const userId = useFilterStore((state) => state.userId)
  const fetching = useIsFetching()
  return (
    <pre className="mt-6 rounded-lg bg-slate-900 p-3 font-mono text-sm text-emerald-300">
      {'Zustand store:  { userId: ' + userId + ' }\n'}
      {'TanStack Query: ' + (fetching ? 'fetching...' : 'idle (data cached)')}
    </pre>
  )
}

// Step 4: QueryClientProvider is needed for TanStack Query (Zustand needs no Provider).
function ZustandQuery() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-6 [&_button]:ml-2 [&_button]:rounded-lg [&_button]:bg-indigo-600 [&_button]:px-3 [&_button]:py-1.5 [&_button]:text-white [&_li]:list-disc [&_li]:ml-5 [&_p]:mt-3 [&_select]:rounded-lg [&_select]:border [&_select]:border-slate-300 [&_select]:px-2 [&_select]:py-1.5 [&_ul]:mt-3">
        <PostList />
        <StateView />
      </div>
    </QueryClientProvider>
  )
}

export default ZustandQuery
