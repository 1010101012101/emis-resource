'use strict';


/* dependencies */
const _ = require('lodash');
const { expect } = require('chai');
const { include } = require('@lykmapipo/include');
const { clear } = require('@lykmapipo/mongoose-test-helpers');
const { Feature } = require('@codetanzania/emis-feature');
const { Party } = require('@codetanzania/emis-stakeholder');
const { Item, Stock, Adjustment } = include(__dirname, '..', '..');


describe('Adjustment Get', () => {

  before(done => {
    clear('Adjustment', 'Stock', 'Item', 'Party', 'Feature', done);
  });

  let store = Feature.fake();
  let owner = Party.fake();
  let items = Item.fake(32);
  let stocks = Stock.fake(32);
  let adjustments = Adjustment.fake(32);

  before((done) => {
    store.post((error, created) => {
      store = created;
      done(error, created);
    });
  });

  before((done) => {
    owner.post((error, created) => {
      owner = created;
      done(error, created);
    });
  });

  before((done) => {
    Item.insertMany(items, (error, created) => {
      items = created;
      done(error, created);
    });
  });

  before((done) => {
    stocks = _.map(stocks, (stock, index) => {
      stock.store = store;
      stock.owner = owner;
      stock.item = items[index];
      return stock;
    });
    Stock.insertMany(stocks, (error, created) => {
      stocks = created;
      done(error, created);
    });
  });

  before((done) => {
    adjustments = _.map(adjustments, (adjustment, index) => {
      adjustment.item = items[index];
      adjustment.stock = stocks[index];
      adjustment.store = store;
      adjustment.party = owner;
      return adjustment;
    });
    Adjustment.insertMany(adjustments, (error, created) => {
      adjustments = created;
      done(error, created);
    });
  });

  it('should be able to get without options', (done) => {
    Adjustment.get((error, results) => {
      expect(error).to.not.exist;
      expect(results).to.exist;
      expect(results.data).to.exist;
      expect(results.data).to.have.length(10);
      expect(results.total).to.exist;
      expect(results.total).to.be.equal(32);
      expect(results.limit).to.exist;
      expect(results.limit).to.be.equal(10);
      expect(results.skip).to.exist;
      expect(results.skip).to.be.equal(0);
      expect(results.page).to.exist;
      expect(results.page).to.be.equal(1);
      expect(results.pages).to.exist;
      expect(results.pages).to.be.equal(4);
      expect(results.lastModified).to.exist;
      expect(_.maxBy(results.data, 'updatedAt').updatedAt)
        .to.be.at.most(results.lastModified);
      done(error, results);
    });
  });

  it('should be able to get with options', (done) => {
    const options = { page: 1, limit: 20 };
    Adjustment.get(options, (error, results) => {
      expect(error).to.not.exist;
      expect(results).to.exist;
      expect(results.data).to.exist;
      expect(results.data).to.have.length(20);
      expect(results.total).to.exist;
      expect(results.total).to.be.equal(32);
      expect(results.limit).to.exist;
      expect(results.limit).to.be.equal(20);
      expect(results.skip).to.exist;
      expect(results.skip).to.be.equal(0);
      expect(results.page).to.exist;
      expect(results.page).to.be.equal(1);
      expect(results.pages).to.exist;
      expect(results.pages).to.be.equal(2);
      expect(results.lastModified).to.exist;
      expect(_.maxBy(results.data, 'updatedAt').updatedAt)
        .to.be.at.most(results.lastModified);
      done(error, results);
    });
  });

  it.skip('should be able to search with options', (done) => {
    // wait search by relations
    const options = { filter: { q: items[0].name } };
    Adjustment.get(options, (error, results) => {
      expect(error).to.not.exist;
      expect(results).to.exist;
      expect(results.data).to.exist;
      expect(results.data).to.have.length.of.at.least(1);
      expect(results.total).to.exist;
      expect(results.total).to.be.at.least(1);
      expect(results.limit).to.exist;
      expect(results.limit).to.be.equal(10);
      expect(results.skip).to.exist;
      expect(results.skip).to.be.equal(0);
      expect(results.page).to.exist;
      expect(results.page).to.be.equal(1);
      expect(results.pages).to.exist;
      expect(results.pages).to.be.equal(1);
      expect(results.lastModified).to.exist;
      expect(_.maxBy(results.data, 'updatedAt').updatedAt)
        .to.be.at.most(results.lastModified);
      done(error, results);
    });
  });

  it.skip('should parse filter options', (done) => {
    // wait search by relations
    const options = { filter: { name: items[0].name } };
    Adjustment.get(options, (error, results) => {
      expect(error).to.not.exist;
      expect(results).to.exist;
      expect(results.data).to.exist;
      expect(results.data).to.have.length.of.at.least(1);
      expect(results.total).to.exist;
      expect(results.total).to.be.at.least(1);
      expect(results.limit).to.exist;
      expect(results.limit).to.be.equal(10);
      expect(results.skip).to.exist;
      expect(results.skip).to.be.equal(0);
      expect(results.page).to.exist;
      expect(results.page).to.be.equal(1);
      expect(results.pages).to.exist;
      expect(results.pages).to.be.equal(1);
      expect(results.lastModified).to.exist;
      expect(_.maxBy(results.data, 'updatedAt').updatedAt)
        .to.be.at.most(results.lastModified);
      done(error, results);
    });
  });

  after(done => {
    clear('Adjustment', 'Stock', 'Item', 'Party', 'Feature', done);
  });

});
