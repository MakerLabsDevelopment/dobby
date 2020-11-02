import React, { ReactElement, useState, useEffect, useRef } from 'react'
import MetaMaskOnboarding from '@metamask/onboarding'
import detectEthereumProvider from '@metamask/detect-provider'

const ONBOARD_TEXT = 'Click here to install MetaMask!'
const CONNECT_TEXT = 'Connect'
const CONNECTED_TEXT = 'Connected'

const MetaMaskConnection = (): ReactElement => {
  const [buttonText, setButtonText] = useState<string>(() => ONBOARD_TEXT)
  const [isDisabled, setDisabled] = useState<boolean>(() => false)
  const [accounts, setAccounts] = useState<any[]>(() => [])
  const onboarding = useRef<MetaMaskOnboarding>()

  const [provider, setProvider] = useState<any>(() => null)
  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding()
    }
    const init = async () => {
      const ethProvider = await detectEthereumProvider()
      if (ethProvider) {
        setProvider(ethProvider)
      }
    }
    init()
  }, [])

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        setButtonText(CONNECTED_TEXT)
        setDisabled(true)
        onboarding.current?.stopOnboarding()
      } else {
        setButtonText(CONNECT_TEXT)
        setDisabled(false)
      }
    }
  }, [accounts])

  useEffect(() => {
    const handleNewAccounts = (newAccounts) => {
      setAccounts(newAccounts)
    }
    if (MetaMaskOnboarding.isMetaMaskInstalled() && provider?.isMetaMask) {
      provider
        .request({ method: 'eth_requestAccounts' })
        .then(handleNewAccounts)
      provider.on('accountsChanged', handleNewAccounts)
      return () => {
        provider.off('accountsChanged', handleNewAccounts)
      }
    }
  }, [])

  const onClick = async () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      const newAccounts = await provider.request({
        method: 'eth_requestAccounts',
      })
      setAccounts(newAccounts)
    } else {
      onboarding.current?.startOnboarding()
    }
  }
  return (
    <button disabled={isDisabled} onClick={onClick}>
      {buttonText}
    </button>
  )
}

export { MetaMaskConnection }
