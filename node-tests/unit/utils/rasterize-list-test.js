'use strict';

const expect        = require('../../helpers/expect');

const RasterizeList = require('../../../src/utils/rasterize-list');

const fs            = require('fs');
const sizeOf        = require('image-size');
const _forOwn       = require('lodash').forOwn;

describe('RasterizeList', function() {
  // Hitting the file system is slow
  this.timeout(0);

  before(() => {
    if (!fs.existsSync('tmp')) fs.mkdirSync('tmp');
  });

  context('when source, projectPath, dest, and platformSizes', () => {
    const source = 'node-tests/fixtures/icon.svg';
    const projectPath = 'tmp';
    const dest = 'icons';
    const platformSizes = {
      ios: {
        itemKey: 'width',
        items: [
          {
            size: 57,
            name: 'icon'
          }
        ]
      }
    };
    let subject;

    before(() => {
      subject = RasterizeList({
        source: source,
        projectPath: projectPath,
        dest: dest,
        platformSizes: platformSizes
      });
    });

    after(() => {
      platformSizes['ios'].items.forEach((rasterize) =>  {
        fs.unlinkSync(`${projectPath}/${rasterize.path}`);
      });
    });

    it('resolves to platform sizes updated with paths', (done) => {
      subject.then((updatedPlatformSizes) => {
        try {
          _forOwn(updatedPlatformSizes, (icons, platform) => {
            icons.items.map((item) => {
              const path = `${dest}/${platform}/${item.name}.png`;
              expect(item.path).to.equal(path);
            });
          });
          done();
        } catch(e) {
          done(e);
        }
      });
    });

    it('writes the files to rasterize at the right size', (done) => {
      subject.then((updatedPlatformSizes) => {
        try {
          updatedPlatformSizes['ios'].items.forEach((rasterize) => {
            const writePath = `${projectPath}/${rasterize.path}`;
            expect(fs.existsSync(writePath)).to.equal(true);
            expect(sizeOf(writePath).width).to.equal(rasterize.size);
            expect(sizeOf(writePath).height).to.equal(rasterize.size);
          });
          done();
        } catch(e) {
          done(e);
        }
      });
    });
  });
});
