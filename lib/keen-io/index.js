
/**
 * Module dependencies.
 */

var integration = require('segmentio/analytics.js-integration');

/**
 * Expose `Keen IO` integration.
 */

var Keen = module.exports = integration('Keen IO')
  .global('Keen')
  .option('projectId', '')
  .option('readKey', '')
  .option('writeKey', '')
  .option('trackNamedPages', true)
  .option('trackAllPages', false)
  .option('trackCategorizedPages', true)
  .tag('<script src="//dc8na2hxrj29i.cloudfront.net/code/keen-2.1.0-min.js">');

/**
 * Initialize.
 *
 * https://keen.io/docs/
 */

Keen.prototype.initialize = function(){
  var options = this.options;
  window.Keen = window.Keen||{ configure:function(e){this._cf=e;}, addEvent:function(e,t,n,i){this._eq=this._eq||[],this._eq.push([e,t,n,i]);}, setGlobalProperties:function(e){this._gp=e;}, onChartsReady:function(e){this._ocrq=this._ocrq||[],this._ocrq.push(e);}};
  window.Keen.configure({
    projectId: options.projectId,
    writeKey: options.writeKey,
    readKey: options.readKey
  });
  this.load(this.ready);
};

/**
 * Loaded?
 *
 * @return {Boolean}
 */

Keen.prototype.loaded = function(){
  return !! (window.Keen && window.Keen.Base64);
};

/**
 * Page.
 *
 * @param {Page} page
 */

Keen.prototype.page = function(page){
  var category = page.category();
  var props = page.properties();
  var name = page.fullName();
  var opts = this.options;

  // all pages
  if (opts.trackAllPages) {
    this.track(page.track());
  }

  // named pages
  if (name && opts.trackNamedPages) {
    this.track(page.track(name));
  }

  // categorized pages
  if (category && opts.trackCategorizedPages) {
    this.track(page.track(category));
  }
};

/**
 * Identify.
 *
 * TODO: migrate from old `userId` to simpler `id`
 *
 * @param {Identify} identify
 */

Keen.prototype.identify = function(identify){
  var traits = identify.traits();
  var id = identify.userId();
  var user = {};
  if (id) user.userId = id;
  if (traits) user.traits = traits;
  window.Keen.setGlobalProperties(function(){
    return { user: user };
  });
};

/**
 * Track.
 *
 * @param {Track} track
 */

Keen.prototype.track = function(track){
  window.Keen.addEvent(track.event(), track.properties());
};
