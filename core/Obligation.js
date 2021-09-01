import { LegalPosition } from "./LegalPosition.js"


export class Obligation extends LegalPosition {

  constructor(name, creditor, debtor, contract) {
    super(name, creditor, debtor, contract)
    this.setActiveState(ObligationActiveState.Null)
    this.setState(ObligationState.Start)
  }

  isViolated() {
    return this.state === ObligationState.Violation
  }

  isInEffect() {
    return this.state === ObligationState.Active && this.stateActive === ObligationActiveState.InEffect
  }

  isSuspended() {
    return this.state === ObligationState.Active && this.stateActive === ObligationActiveState.Suspension
  }

  isFulfilled(){
    return this.state === ObligationState.Fulfillment
  }

  isActive () {
    this.state === ObligationState.Active
  }

  trigerredConditional() {
    let wasEventProcessed = false

    let aStatus = this.state
    switch (aStatus) {
      case ObligationState.Start:
        this.setState(ObligationState.Create)
        wasEventProcessed = true
        break
      default:
      // Other states do respond to this event
    }

    return wasEventProcessed
  }

  trigerredUnconditional() {
    let wasEventProcessed = false

    let aStatus = this.state
    switch (aStatus) {
      case ObligationState.Start:
        this.setActiveState(ObligationActiveState.InEffect)
        wasEventProcessed = true
        break
      default:
      // Other states do respond to this event
    }

    return wasEventProcessed
  }

  expired() {
    let wasEventProcessed = false

    let aStatus = this.state
    switch (aStatus) {
      case ObligationState.Create:
        this.setState(ObligationState.Discharge)
        wasEventProcessed = true
        break
      default:
      // Other states do respond to this event
    }

    return wasEventProcessed
  }

  discharged() {
    if (!this.contract.isInEffect()) {
      return false
    }
    let wasEventProcessed = false

    let aStatus = this.state
    switch (aStatus) {
      case ObligationState.InEffect:
        this.exitStatus()
        this.setState(ObligationState.Discharge)
        wasEventProcessed = true
        break
      default:
      // Other states do respond to this event
    }

    return wasEventProcessed
  }

  activated() {
    if (!this.contract.isInEffect()) {
      return false
    }
    let wasEventProcessed = false

    let aStatus = this.state
    switch (aStatus) {
      case ObligationState.Create:
        this.setActiveState(ObligationActiveState.InEffect)
        wasEventProcessed = true
        break
      default:
      // Other states do respond to this event
    }

    return wasEventProcessed
  }

  terminated() {
    let wasEventProcessed = false

    let aStatus = this.state
    switch (aStatus) {
      case ObligationState.Active:
        this.exitStatus()
        this.setState(ObligationState.UnsuccessfulTermination)
        wasEventProcessed = true
        break
      default:
      // Other states do respond to this event
    }

    return wasEventProcessed
  }

  fulfilled() {
    let wasEventProcessed = false

    let aStatusActive = this.stateActive
    switch (aStatusActive) {
      case ObligationActiveState.InEffect:
        this.exitStatus()
        this.setState(ObligationState.Fulfillment)
        wasEventProcessed = true
        break
      default:
      // Other states do respond to this event
    }

    return wasEventProcessed
  }

  violated() {
    let wasEventProcessed = false

    let aStatusActive = this.stateActive
    switch (aStatusActive) {
      case ObligationActiveState.InEffect:
        this.exitStatus()
        this.setState(ObligationState.Violation)
        wasEventProcessed = true
        break
      default:
      // Other states do respond to this event
    }

    return wasEventProcessed
  }

  suspended() {
    let wasEventProcessed = false

    let aStatusActive = this.stateActive
    switch (aStatusActive) {
      case ObligationActiveState.InEffect:
        this.exitStatusActive()
        this.setActiveState(ObligationActiveState.Suspension)
        wasEventProcessed = true
        break
      default:
      // Other states do respond to this event
    }

    return wasEventProcessed
  }

  resumed() {
    let wasEventProcessed = false

    let aStatusActive = this.stateActive
    switch (aStatusActive) {
      case ObligationActiveState.Suspension:
        this.exitStatusActive()
        this.setActiveState(ObligationActiveState.InEffect)
        wasEventProcessed = true
        break
      default:
      // Other states do respond to this event
    }

    return wasEventProcessed
  }

  exitStatus() {
    switch (this.state) {
      case ObligationState.Active:
        this.exitStatusActive()
        break
    }
  }

  setState(aStatus) {
    this.state = aStatus

    // entry actions and do activities
    switch (this.state) {
      case ObligationState.Active:
        if (this.stateActive == ObligationActiveState.Null) {
          this.setActiveState(ObligationActiveState.InEffect)
        }
        break
      case ObligationState.Violation:
        break
      case ObligationState.Discharge:
        break
      case ObligationState.Fulfillment:
        break
      case ObligationState.UnsuccessfulTermination:
        break
    }
  }

  exitStatusActive() {
    switch (this.stateActive) {
      case ObligationActiveState.InEffect:
        this.setActiveState(ObligationActiveState.Null)
        break
      case ObligationActiveState.Suspension:
        this.setActiveState(ObligationActiveState.Null)
        break
    }
  }

  setActiveState(aStatusActive) {
    this.stateActive = aStatusActive
    if (this.state != ObligationState.Active && aStatusActive != ObligationActiveState.Null) {
      this.setState(ObligationState.Active)
    }
  }

}

export const ObligationState = {
  Start: 'Start',
  Create: 'Create',
  Active: 'Active',
  Violation: 'Violation',
  Discharge: 'Discharge',
  Fulfillment: 'Fulfillment',
  UnsuccessfulTermination: 'UnsuccessfulTermination'
}
export const ObligationActiveState = {
  Null: 'Null',
  InEffect: 'InEffect',
  Suspension: 'Suspension'
}
