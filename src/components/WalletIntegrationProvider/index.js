import { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import { map } from 'lodash'
import { registerProvider, updateProvider, initGnosis } from 'actions/blockchain'

const GNOSIS_REINIT_KEYS = ['network', 'account', 'available']

class WalletIntegrationProvider extends Component {
  constructor(props) {
    super(props)
    const { integrations } = props

    const providerOptions = {
      runProviderUpdate: this.handleProviderUpdate,
      runProviderRegister: this.handleProviderRegister,
    }
    window.addEventListener('load', () => {
      Promise.all(map(integrations, integration => integration.initialize(providerOptions)))
        .then(this.props.initGnosis, this.props.initGnosis)
        .catch(this.props.initGnosis)
    })
  }

  @autobind
  async handleProviderUpdate(provider, data) {
    await this.props.updateProvider({
      provider: provider.constructor.providerName,
      ...data,
    })

    let requireGnosisReinit = false
    GNOSIS_REINIT_KEYS.forEach((searchKey) => {
      if (Object.keys(data).indexOf(searchKey) > -1) {
        requireGnosisReinit = true
      }
    })

    if (requireGnosisReinit) {
      await this.props.initGnosis()
    }
  }

  @autobind
  async handleProviderRegister(provider, data) {
    await this.props.registerProvider({
      provider: provider.constructor.providerName,
      ...data,
    })
  }

  render() {
    const { children } = this.props

    return children
  }
}

WalletIntegrationProvider.propTypes = {
  children: PropTypes.element,
  integrations: PropTypes.objectOf(PropTypes.object),
  registerProvider: PropTypes.func.isRequired,
  updateProvider: PropTypes.func.isRequired,
  initGnosis: PropTypes.func.isRequired,
}

export default connect(null, {
  registerProvider,
  updateProvider,
  initGnosis,
})(WalletIntegrationProvider)
