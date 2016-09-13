'use strict';

const expect        = require('../../helpers/expect');

const SaveCdvXML    = require('../../../src/utils/save-cordova-xml');

const fs            = require('fs');
const SerializeIcon = require('../../../src/utils/serialize-icon');

describe('SaveCordovaXML', function() {
  const fixturePath = 'node-tests/fixtures/config.xml';
  const tmpFixturePath = 'tmp/config.xml';

  const projectPath = 'tmp';

  before(() => {
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath);
    }
  });

  afterEach(() => {
    fs.unlinkSync(tmpFixturePath);
  });

  context('when projectPath, desiredNodes, keyName, and serializeFn', () => {
    const projectPath = 'tmp/';
    const desiredNodes = {
      ios: {
        itemKey: 'width',
        items: [
          { size: 60,  name: 'icon-60', src: 'tmp/ios/icon-60.png' }
        ]
      }
    };
    const keyName = 'icon';
    const serializeFn = SerializeIcon;
    const args = {
      projectPath: projectPath,
      desiredNodes: desiredNodes,
      keyName: keyName,
      serializeFn: serializeFn
    };

    context('when config.xml has no platform nodes', () => {
      before((done) => {
        const fixtureStream = fs.createReadStream(`${fixturePath}/no-platform-nodes.xml`)
        const tmpFixtureStream = fs.createWriteStream(tmpFixturePath)
        fixtureStream.pipe(tmpFixtureStream);

        tmpFixtureStream.on('finish', () => {
          done();
        });
      });

      it('it adds the platform node with icon nodes', (done) => {
        SaveCdvXML(args).then(() => {
          const configXML = fs.readFileSync(tmpFixturePath, 'utf8');
          const expectedConfigXML = fs.readFileSync(
            `${fixturePath}/no-and-ios-platform-node-expected.xml`, 'utf8'
          );

          try {
            expect(configXML).to.equal(expectedConfigXML);
            done();
          } catch(e) {
            done(e);
          }
        })
        .catch((e) => {
          done(e);
        });
      });
    });

    context('when config.xml has desiredNodes platform', () => {
      before((done) => {
        const fixtureStream = fs.createReadStream(`${fixturePath}/ios-platform-node.xml`)
        const tmpFixtureStream = fs.createWriteStream(tmpFixturePath)
        fixtureStream.pipe(tmpFixtureStream);

        tmpFixtureStream.on('finish', () => {
          done();
        });
      });

      it('it replaces the icon nodes', (done) => {
        SaveCdvXML(args).then(() => {
          const configXML = fs.readFileSync(tmpFixturePath, 'utf8');
          const expectedConfigXML = fs.readFileSync(
            `${fixturePath}/no-and-ios-platform-node-expected.xml`, 'utf8'
          );

          try {
            expect(configXML).to.equal(expectedConfigXML);
            done();
          } catch(e) {
            done(e);
          }
        })
        .catch((e) => {
          done(e);
        });
      });
    });

    context('when config.xml does not have desiredNodes platform', () => {
      before((done) => {
        const fixtureStream = fs.createReadStream(`${fixturePath}/android-platform-node.xml`)
        const tmpFixtureStream = fs.createWriteStream(tmpFixturePath)
        fixtureStream.pipe(tmpFixtureStream);

        tmpFixtureStream.on('finish', () => {
          done();
        });
      });

      it('it adds the platform node with icon nodes', (done) => {
        SaveCdvXML(args).then(() => {
          const configXML = fs.readFileSync(tmpFixturePath, 'utf8');
          const expectedConfigXML = fs.readFileSync(
            `${fixturePath}/android-platform-node-expected.xml`, 'utf8'
          );

          try {
            expect(configXML).to.equal(expectedConfigXML);
            done();
          } catch(e) {
            done(e);
          }
        })
        .catch((e) => {
          done(e);
        });
      });
    });
  });
});
