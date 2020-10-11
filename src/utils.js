import { getConfiguredCache } from 'money-clip'

const cache = getConfiguredCache({
  maxAge: 1000 * 60 * 60,
  name: 'dbdb',
  version: 1
})

export { cache }
