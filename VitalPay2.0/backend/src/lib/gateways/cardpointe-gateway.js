const { PaymentGateway } = require('../payment-gateway');
const { CardPointeClient } = require('../cardpointe-client');
const { toCents } = require('../../utils/amount');

class CardPointeGateway extends PaymentGateway {
  constructor(config) {
    super('cardpointe');
    this.config = config;
    this.client = new CardPointeClient(config);
  }

  async tokenize(cardData) {
    return this.client.tokenize(cardData);
  }

  async authorize(transaction, idempotencyKey) {
    const payload = {
      merchid: transaction.merchid || this.config.merchId,
      account: transaction.token || transaction.account,
      expiry: transaction.expiry,
      amount: toCents(transaction.amount),
      currency: transaction.currency || 'USD',
      capture: transaction.capture ?? 'Y',
      name: transaction.name,
      accttype: transaction.accttype,
      achDescription: transaction.achDescription,
      achEntryCode: transaction.achEntryCode,
    };

    return this.client.auth(payload, idempotencyKey);
  }

  async capture(transaction) {
    return this.client.capture({
      merchid: transaction.merchid || this.config.merchId,
      retref: transaction.retref,
      amount: transaction.amount ? toCents(transaction.amount) : undefined,
    });
  }

  async void(transaction) {
    return this.client.void({
      merchid: transaction.merchid || this.config.merchId,
      retref: transaction.retref,
    });
  }

  async refund(transaction) {
    return this.client.refund({
      merchid: transaction.merchid || this.config.merchId,
      retref: transaction.retref,
      amount: transaction.amount ? toCents(transaction.amount) : undefined,
    });
  }

  async inquire(transaction) {
    return this.client.inquire({
      retref: transaction.retref,
      merchid: transaction.merchid || this.config.merchId,
    });
  }

  mapToTransactionRecord(response, input = {}) {
    const approved = this.isApproved(response);
    return {
      gateway: 'cardpointe',
      retref: response.retref,
      merchid: response.merchid || input.merchid || this.config.merchId,
      authcode: response.authcode,
      respstat: response.respstat,
      respcode: response.respcode,
      resptext: response.resptext,
      amount: response.amount ? Number(response.amount) : input.amount,
      currency: input.currency || 'USD',
      status: approved ? (input.capture === 'N' ? 'authorized' : 'captured') : 'failed',
      paymentMethod: input.accttype ? 'ach' : 'card',
      achreturncode: response.achreturncode,
      processorResponse: response,
      ghlTransactionId: input.ghlTransactionId,
      ghlContactId: input.contactId,
      ghlLocationId: input.locationId,
      createdAt: new Date(),
    };
  }
}

module.exports = { CardPointeGateway };
