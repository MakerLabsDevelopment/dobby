import React, {
  Suspense,
  ReactElement,
  useState,
  useEffect,
  useRef,
} from 'react'
import MetaMaskOnboarding from '@metamask/onboarding'
import { RootPage } from '../components/RootPage'
import { Loading } from '../components/Loading'
import { Bases } from '../components/Bases'
import 'semantic-ui-css/semantic.min.css'

const HomePage = (): ReactElement => {
  // @ts-ignore
  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!')
  } else {
    console.log('nope')
  }
  // @ts-ignore
  if (typeof web3 !== 'undefined') {
    // @ts-ignore
    web3 = new Web3(web3.currentProvider)
    // @ts-ignore
    console.log(web3)
  } else {
    // @ts-ignore
    web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  }
  return (
    <RootPage>
      <h1>Databases</h1>
      <OnboardingButton />
      <Suspense fallback={<Loading />}>
        <Bases />
      </Suspense>
    </RootPage>
  )
}

const ONBOARD_TEXT = 'Click here to install MetaMask!'
const CONNECT_TEXT = 'Connect'
const CONNECTED_TEXT = 'Connected'

const OnboardingButton = () => {
  const [buttonText, setButtonText] = useState<string>(() => ONBOARD_TEXT)
  const [isDisabled, setDisabled] = useState<boolean>(() => false)
  const [accounts, setAccounts] = useState<any[]>(() => [])
  const onboarding = useRef<MetaMaskOnboarding>()

  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding()
    }
  }, [])

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        setButtonText(CONNECTED_TEXT)
        setDisabled(true)
        onboarding.current.stopOnboarding()
      } else {
        setButtonText(CONNECT_TEXT)
        setDisabled(false)
      }
    }
  }, [accounts])

  React.useEffect(() => {
    const handleNewAccounts = (newAccounts) => {
      setAccounts(newAccounts)
    }
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      // @ts-ignore
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(handleNewAccounts)
      // @ts-ignore
      window.ethereum.on('accountsChanged', handleNewAccounts)
      return () => {
        // @ts-ignore
        window.ethereum.off('accountsChanged', handleNewAccounts)
      }
    }
  }, [])

  const onClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      // @ts-ignore
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((newAccounts) => setAccounts(newAccounts))
    } else {
      // @ts-ignore
      onboarding.current.startOnboarding()
    }
  }
  return (
    <button disabled={isDisabled} onClick={onClick}>
      {buttonText}
    </button>
  )
}
export { HomePage }
