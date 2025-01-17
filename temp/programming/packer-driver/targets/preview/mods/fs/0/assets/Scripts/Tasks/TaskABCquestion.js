System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, _decorator, AudioSource, randomRangeInt, GenericUIABC, Task, GameManager, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp, _crd, ccclass, property, TaskABCquestion;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGenericUIABC(extras) {
    _reporterNs.report("GenericUIABC", "../Utilities/GenericUI-ABC", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTask(extras) {
    _reporterNs.report("Task", "./Task", _context.meta, extras);
  }

  function _reportPossibleCrUseOfJSONtask(extras) {
    _reporterNs.report("JSONtask1", "../RemoteScripts/JSONloader", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "../GameManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      _decorator = _cc._decorator;
      AudioSource = _cc.AudioSource;
      randomRangeInt = _cc.randomRangeInt;
    }, function (_unresolved_2) {
      GenericUIABC = _unresolved_2.GenericUIABC;
    }, function (_unresolved_3) {
      Task = _unresolved_3.Task;
    }, function (_unresolved_4) {
      GameManager = _unresolved_4.GameManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2e706IUcmpO8Z7VRvWDJPru", "TaskABCquestion", undefined);

      ({
        ccclass,
        property
      } = _decorator);

      _export("TaskABCquestion", TaskABCquestion = (_dec = ccclass('TaskABCquestion'), _dec2 = property(String), _dec3 = property(Number), _dec(_class = (_class2 = (_temp = class TaskABCquestion extends (_crd && Task === void 0 ? (_reportPossibleCrUseOfTask({
        error: Error()
      }), Task) : Task) {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "remoteName", _descriptor, this);

          _initializerDefineProperty(this, "expectedQuestions", _descriptor2, this);

          _defineProperty(this, "questionsTempArray", new Array());

          _defineProperty(this, "questionsShown", new Array());

          _defineProperty(this, "questionShownFilled", false);

          _defineProperty(this, "audioSource", null);
        }

        start() {
          // this.scheduleOnce(this.getQuestions, this.orderNumber * 0.05);
          this.schedule(this.isItMyTimeForDownloading, 0.1);
          this.audioSource = this.node.getComponent(AudioSource);
          this.scheduleOnce(this.fillQuestionsShownFalse, this.orderNumber * 0.05 + 2);
        }

        isItMyTimeForDownloading() {
          if (this.orderNumber <= (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager).getInstance().downloadedCheckpoint && !this.downloadStarted) {
            this.getQuestions();
            this.downloadStarted = true;
          }
        }

        fillQuestionsShownFalse() {
          this.questionsTempArray.forEach(element => {
            this.questionsShown.push(false);
          });
        }

        getQuestions() {
          if (this.remoteName != "") {
            var _getInstance$jsonLoad;

            (_getInstance$jsonLoad = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
              error: Error()
            }), GameManager) : GameManager).getInstance().jsonLoader) === null || _getInstance$jsonLoad === void 0 ? void 0 : _getInstance$jsonLoad.fetchQuestions(this.remoteName, this.questionsTempArray, this.expectedQuestions);
          }
        }

        getRandomTask() {
          var imamoNekoriscene = false;
          var nasaoNekoriscenog = false;
          var randomIndex = randomRangeInt(0, this.questionsShown.length);
          this.questionsShown.forEach(element => {
            if (element == false) imamoNekoriscene = true;
          });
          console.log("imamoNekoriscene: " + imamoNekoriscene);

          if (imamoNekoriscene) {
            while (!nasaoNekoriscenog) {
              randomIndex = randomRangeInt(0, this.questionsShown.length);
              if (!this.questionsShown[randomIndex]) nasaoNekoriscenog = true;
            }
          }

          console.log("QUESTION ARRAY LENGHT" + this.questionsShown.length);
          console.log("randomIndex: " + randomIndex);
          this.questionsShown[randomIndex] = true;
          return this.questionsTempArray[randomIndex];
        }

        showTask() {
          console.log("ShowTask!!!");

          if (this.isItOkToExecute()) {
            var _getInstance$loadingH2;

            if ((_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
              error: Error()
            }), GameManager) : GameManager).getInstance().downloadedCheckpoint <= this.orderNumber) {
              var _getInstance$loadingH;

              (_getInstance$loadingH = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
                error: Error()
              }), GameManager) : GameManager).getInstance().loadingHandler) === null || _getInstance$loadingH === void 0 ? void 0 : _getInstance$loadingH.turnOnLoading();
              this.scheduleOnce(this.showTask, 0.2);
              console.log("DownloadedCheckpoint : " + (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
                error: Error()
              }), GameManager) : GameManager).getInstance().downloadedCheckpoint);
              console.log("this.orderNumber : " + this.orderNumber);
              return;
            }

            (_getInstance$loadingH2 = (_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
              error: Error()
            }), GameManager) : GameManager).getInstance().loadingHandler) === null || _getInstance$loadingH2 === void 0 ? void 0 : _getInstance$loadingH2.turnOffLoading();
            this.taskManager.genericUIABC.active = true;
            this.taskManager.genericUIABC.getComponent(_crd && GenericUIABC === void 0 ? (_reportPossibleCrUseOfGenericUIABC({
              error: Error()
            }), GenericUIABC) : GenericUIABC).turnOnGenericTask(this.node); //Čestitam! Stigao si do časovničara.
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "remoteName", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "expectedQuestions", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      })), _class2)) || _class));
      /**
       * [1] Class member could be defined like this.
       * [2] Use `property` decorator if your want the member to be serializable.
       * [3] Your initialization goes here.
       * [4] Your update function goes here.
       *
       * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
       * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
       * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
       */


      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=TaskABCquestion.js.map