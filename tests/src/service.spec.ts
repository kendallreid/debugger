import { expect } from 'chai';

import { ClientSession, IClientSession } from '@jupyterlab/apputils';

import { createClientSession } from '@jupyterlab/testutils';

import { Debugger } from '../../lib/debugger';

import { DebugService } from '../../lib/service';

import { DebugSession } from '../../lib/session';

import { IDebugger } from '../../lib/tokens';

describe('DebugService', () => {
  let client: IClientSession;
  let model: Debugger.Model;
  let session: IDebugger.ISession;
  let service: IDebugger;

  beforeEach(async () => {
    client = await createClientSession({
      kernelPreference: {
        name: 'xpython'
      }
    });
    await (client as ClientSession).initialize();
    await client.kernel.ready;
    session = new DebugSession({ client });
    model = new Debugger.Model({});
    service = new DebugService();
  });

  afterEach(async () => {
    await client.shutdown();
    session.dispose();
    service.dispose();
  });

  describe('#constructor()', () => {
    it('should create a new instance', () => {
      expect(service).to.be.an.instanceOf(DebugService);
    });
  });

  describe('#start()', () => {
    it('should start the service if the session is set', async () => {
      service.session = session;
      await service.start();
      expect(service.isStarted()).to.equal(true);
    });

    it('should throw an error if the session is not set', async () => {
      try {
        await service.start();
      } catch (err) {
        expect(err.message).to.contain("Cannot read property 'start' of null");
      }
    });
  });

  describe('#stop()', () => {
    it('should stop the service if the session is set', async () => {
      service.session = session;
      await service.start();
      await service.stop();
      expect(service.isStarted()).to.equal(false);
    });
  });

  describe('#session', () => {
    it('should emit the sessionChanged signal when setting the session', () => {
      let sessionChangedEvents: IDebugger.ISession[] = [];
      service.sessionChanged.connect((_, newSession) => {
        sessionChangedEvents.push(newSession);
      });
      service.session = session;
      expect(sessionChangedEvents.length).to.equal(1);
      expect(sessionChangedEvents[0]).to.eq(session);
    });
  });

  describe('#model', () => {
    it('should emit the modelChanged signal when setting the model', () => {
      let modelChangedEvents: Debugger.Model[] = [];
      service.modelChanged.connect((_, newModel) => {
        modelChangedEvents.push(newModel);
      });
      service.model = model;
      expect(modelChangedEvents.length).to.equal(1);
      expect(modelChangedEvents[0]).to.eq(model);
    });
  });
});