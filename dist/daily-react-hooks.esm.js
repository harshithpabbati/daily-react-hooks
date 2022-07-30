import DailyIframe from '@daily-co/daily-js';
import React, { createContext, useContext, useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { atom, selectorFamily, useRecoilCallback, RecoilRoot, useRecoilValue, atomFamily, useSetRecoilState, selector } from 'recoil';
import throttle from 'lodash.throttle';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var DailyContext = /*#__PURE__*/createContext(null);

var DailyEventContext = /*#__PURE__*/createContext({
  on: function on() {},
  off: function off() {}
});

/**
 * Returns callObject instance passed to or created by closest <DailyProvider>.
 */

var useDaily = function useDaily() {
  var daily = useContext(DailyContext);
  return daily;
};

var uniqueCounter = 0;
var getUnique = function getUnique() {
  return uniqueCounter++;
};
/**
 * Sets up a daily event listener using [on](https://docs.daily.co/reference/daily-js/instance-methods/on) method.
 * When this hook is unmounted the event listener is unregistered using [off](https://docs.daily.co/reference/daily-js/instance-methods/off).
 *
 * Warning: callback has to be a memoized reference (e.g. via [useCallback](https://reactjs.org/docs/hooks-reference.html#usecallback)).
 * Otherwise a console error might be thrown indicating a re-render loop issue.
 *
 * @param ev The DailyEvent to register.
 * @param callback A memoized callback reference to run when the event is emitted.
 */

var useDailyEvent = function useDailyEvent(ev, callback) {
  var _useContext = useContext(DailyEventContext),
      off = _useContext.off,
      on = _useContext.on;

  var _useState = useState(false),
      isBlocked = _useState[0],
      setIsBlocked = _useState[1];

  var reassignCount = useRef(0);
  var eventId = useMemo(function () {
    return getUnique();
  }, []);
  useEffect(function () {
    if (!ev || isBlocked) return;
    /**
     * Check if callback has been reassigned often enough without hitting the 50ms timeout.
     */

    if (reassignCount.current > 100000) {
      console.error("useDailyEvent called with potentially non-memoized event callback or due to too many re-renders.\n        Memoize using useCallback to avoid re-render loop or reduce the amount of state transitions the callback depends on.\n        Passed callback for '" + ev + "' event is NOT registered.", callback);
      setIsBlocked(true);
      return;
    }

    reassignCount.current++;
    var timeout = setTimeout(function () {
      reassignCount.current = 0;
    }, 50);
    on(ev, callback, eventId);
    return function () {
      clearTimeout(timeout);
      off(ev, eventId);
    };
  }, [callback, ev, eventId, isBlocked, off, on]);
};

/**
 * Sets up a throttled daily event listener using [on](https://docs.daily.co/reference/daily-js/instance-methods/on) method.
 * When this hook is unmounted the event listener is unregistered using [off](https://docs.daily.co/reference/daily-js/instance-methods/off).
 *
 * In comparison to useDailyEvent the callback passed here will be called with an array of event objects.
 *
 * @param ev The DailyEvent to register.
 * @param callback A memoized callback reference to run when throttled events are emitted.
 * @param throttleTimeout The minimum waiting time until the callback is called again. Default: 100
 */

var useThrottledDailyEvent = function useThrottledDailyEvent(ev, callback, throttleTimeout) {
  if (throttleTimeout === void 0) {
    throttleTimeout = 100;
  }

  var _useContext = useContext(DailyEventContext),
      off = _useContext.off,
      on = _useContext.on;

  var eventId = useMemo(function () {
    return getUnique();
  }, []);
  var throttledEvents = useRef([]);
  var emitEvents = useMemo(function () {
    return throttle(function () {
      if (throttledEvents.current.length === 0) return;
      callback(throttledEvents.current);
      throttledEvents.current = [];
    }, throttleTimeout, {
      trailing: true
    });
  }, [callback, throttleTimeout]);
  useEffect(function () {
    if (!ev) return;

    var addEvent = function addEvent(ev) {
      throttledEvents.current.push(ev);
      /**
       * A 0ms timeout allows the event loop to process additional incoming events,
       * while the throttle is active. Otherwise every event would be delayed.
       */

      setTimeout(emitEvents, 0);
    };

    on(ev, addEvent, eventId);
    return function () {
      off(ev, eventId);
    };
  }, [emitEvents, ev, eventId, off, on]);
};

var resolveParticipantPath = function resolveParticipantPath(participant, path) {
  // ignoring the typescript here as the Paths of ExtendedDailyParticipant are not directly accessible
  // in the ExtendedDailyParticipant object
  // @ts-ignore
  return path.split('.').reduce(function (r, k) {
    return r == null ? void 0 : r[k];
  }, participant);
};

var localIdState = /*#__PURE__*/atom({
  key: 'local-id',
  "default": ''
});
var participantsState = /*#__PURE__*/atom({
  key: 'participants-objects',
  "default": []
});
/**
 * Holds each individual participant's state object.
 */

var participantState = /*#__PURE__*/selectorFamily({
  key: 'participant',
  get: function get(id) {
    return function (_ref) {
      var _participants$find;

      var get = _ref.get;
      var participants = get(participantsState);
      return (_participants$find = participants.find(function (p) {
        return p.session_id === id;
      })) != null ? _participants$find : null;
    };
  }
});
/**
 * Holds each individual participant's property.
 */

var participantPropertyState = /*#__PURE__*/selectorFamily({
  key: 'participant-property',
  get: function get(_ref2) {
    var id = _ref2.id,
        property = _ref2.property;
    return function (_ref3) {
      var _participants$find2;

      var get = _ref3.get;
      var participants = get(participantsState);
      var participant = (_participants$find2 = participants.find(function (p) {
        return p.session_id === id;
      })) != null ? _participants$find2 : null;
      if (!participant) return null;
      return resolveParticipantPath(participant, property);
    };
  }
});
var DailyParticipants = function DailyParticipants(_ref4) {
  var children = _ref4.children;
  var daily = useDaily();
  useDailyEvent('active-speaker-change', useRecoilCallback(function (_ref5) {
    var set = _ref5.set,
        snapshot = _ref5.snapshot;
    return /*#__PURE__*/function () {
      var _ref6 = _asyncToGenerator(function* (ev) {
        var sessionId = ev.activeSpeaker.peerId;
        var participant = yield snapshot.getPromise(participantState(sessionId));

        if (!participant && daily) {
          participant = daily.participants()[sessionId];
        }

        if (!participant) return;
        set(participantsState, function (prev) {
          return [].concat(prev).map(function (p) {
            return p.session_id === sessionId ? _extends({}, p, {
              last_active: new Date()
            }) : p;
          });
        });
      });

      return function (_x) {
        return _ref6.apply(this, arguments);
      };
    }();
  }, [daily]));
  var initParticipants = useRecoilCallback(function (_ref7) {
    var set = _ref7.set;
    return /*#__PURE__*/function () {
      var _ref8 = _asyncToGenerator(function* (participants) {
        set(localIdState, participants.local.session_id);
        set(participantsState, Object.values(participants));
      });

      return function (_x2) {
        return _ref8.apply(this, arguments);
      };
    }();
  }, []);
  /**
   * Initialize participants state based on daily.participants().
   * Retries every 100ms to initialize the state, until daily is ready.
   */

  useEffect(function () {
    if (!daily) return;
    var interval = setInterval(function () {
      var participants = daily.participants();
      if (!('local' in participants)) return;
      initParticipants(participants);
      clearInterval(interval);
    }, 100);
    return function () {
      clearInterval(interval);
    };
  }, [daily, initParticipants]);
  var handleInitEvent = useCallback(function () {
    if (!daily) return;
    var participants = daily == null ? void 0 : daily.participants();
    if (!participants.local) return;
    initParticipants(participants);
  }, [daily, initParticipants]);
  useDailyEvent('started-camera', handleInitEvent);
  useDailyEvent('access-state-updated', handleInitEvent);
  useDailyEvent('joining-meeting', handleInitEvent);
  useDailyEvent('joined-meeting', useCallback(function (ev) {
    initParticipants(ev.participants);
  }, [initParticipants]));
  /**
   * Add new participant to state, if not already existent.
   */

  useThrottledDailyEvent('participant-joined', useRecoilCallback(function (_ref9) {
    var set = _ref9.set;
    return /*#__PURE__*/function () {
      var _ref10 = _asyncToGenerator(function* (evts) {
        if (!evts.length) return;
        set(participantsState, function (prev) {
          return [].concat(prev, evts.map(function (_ref11) {
            var participant = _ref11.participant;
            return participant;
          })).filter(function (participant, idx, arr) {
            return arr.findIndex(function (p) {
              return p.session_id === participant.session_id;
            }) == idx;
          });
        });
      });

      return function (_x3) {
        return _ref10.apply(this, arguments);
      };
    }();
  }, []));
  /**
   * Update participant in state.
   */

  useThrottledDailyEvent('participant-updated', useRecoilCallback(function (_ref12) {
    var transact_UNSTABLE = _ref12.transact_UNSTABLE;
    return function (evts) {
      transact_UNSTABLE(function (_ref13) {
        var set = _ref13.set;
        evts.forEach(function (_ref14) {
          var participant = _ref14.participant;
          set(participantsState, function (prev) {
            return [].concat(prev).map(function (p) {
              return p.session_id === participant.session_id ? participant : p;
            });
          });
        });
      });
    };
  }, []));
  /**
   * Remove left participant from state.
   */

  useThrottledDailyEvent('participant-left', useRecoilCallback(function (_ref15) {
    var set = _ref15.set;
    return function (evts) {
      set(participantsState, function (prev) {
        return [].concat(prev).filter(function (p) {
          return !evts.some(function (ev) {
            return ev.participant.session_id === p.session_id;
          });
        });
      });
    };
  }, []));
  /**
   * Reset stored participants, when meeting has ended.
   */

  useDailyEvent('left-meeting', useRecoilCallback(function (_ref16) {
    var reset = _ref16.reset;
    return function () {
      reset(localIdState);
      reset(participantsState);
    };
  }, []));
  return React.createElement(React.Fragment, null, children);
};

var roomState = /*#__PURE__*/atom({
  key: 'room',
  "default": null
});
var DailyRoom = function DailyRoom(_ref) {
  var children = _ref.children;
  var daily = useDaily();
  var updateRoom = useRecoilCallback(function (_ref2) {
    var set = _ref2.set;
    return /*#__PURE__*/_asyncToGenerator(function* () {
      if (!daily || daily.meetingState() === 'left-meeting') return;
      var room = yield daily.room();

      if (room && 'id' in room) {
        set(roomState, room);
      }

      return room;
    });
  }, [daily]);
  useDailyEvent('access-state-updated', updateRoom);
  return React.createElement(React.Fragment, null, children);
};

var _excluded = ["children"];
var DailyProvider = function DailyProvider(_ref) {
  var children = _ref.children,
      props = _objectWithoutPropertiesLoose(_ref, _excluded);

  var _useState = useState('callObject' in props ? props.callObject : null),
      callObject = _useState[0],
      setCallObject = _useState[1];

  var eventsMap = useRef({});
  /**
   * Update callObject reference, in case externally created instance has changed.
   */

  useEffect(function () {
    var _props$callObject;

    if ('callObject' in props && callObject && props.callObject && // TODO: Replace _callFrameId check with something "official".
    // @ts-ignore
    (callObject == null ? void 0 : callObject._callFrameId) !== (props == null ? void 0 : (_props$callObject = props.callObject) == null ? void 0 : _props$callObject._callFrameId)) {
      setCallObject(props.callObject);
    }
  }, [callObject, props]);
  /**
   * Generic event handler to loop through registered event callbacks.
   */

  var handleEvent = useCallback(function (ev) {
    if (!('action' in ev)) return;
    var event = ev.action;

    for (var _iterator = _createForOfIteratorHelperLoose((_eventsMap$current$ev = (_eventsMap$current = eventsMap.current) == null ? void 0 : (_eventsMap$current$ev2 = _eventsMap$current[event]) == null ? void 0 : _eventsMap$current$ev2.values()) != null ? _eventsMap$current$ev : []), _step; !(_step = _iterator()).done;) {
      var _eventsMap$current$ev, _eventsMap$current, _eventsMap$current$ev2;

      var cb = _step.value;
      cb(ev);
    }
  }, []);
  /**
   * In case events are setup via useDailyEvent before a DailyCall instance is available,
   * we'll register the events whenever daily is set.
   */

  var initEventHandlers = useCallback(function (daily) {
    if (!daily) return;
    Object.keys(eventsMap.current).forEach(function (event) {
      daily.off(event, handleEvent).on(event, handleEvent);
    });
  }, [handleEvent]);
  useEffect(function () {
    if (callObject) return;

    if ('callObject' in props) {
      setCallObject(props.callObject);
      initEventHandlers(props.callObject);
      return;
    }

    var co = DailyIframe.createCallObject(props);
    setCallObject(co);
    initEventHandlers(co);
  }, [callObject, initEventHandlers, props]);
  /**
   * Registers event callback.
   */

  var on = useCallback(function (ev, cb, key) {
    var _eventsMap$current$ev3;

    if (!eventsMap.current[ev]) {
      eventsMap.current[ev] = new Map();

      if (callObject) {
        /**
         * Make sure only 1 event listener is registered at anytime for handleEvent.
         * Otherwise events sent from daily-js might be handled multiple times.
         */
        callObject.off(ev, handleEvent).on(ev, handleEvent);
      }
    }

    if (!((_eventsMap$current$ev3 = eventsMap.current[ev]) != null && _eventsMap$current$ev3.has(key))) {
      var _eventsMap$current$ev4;

      (_eventsMap$current$ev4 = eventsMap.current[ev]) == null ? void 0 : _eventsMap$current$ev4.set(key, cb);
    }
  }, [callObject, handleEvent]);
  /**
   * Unregisters event callback.
   */

  var off = useCallback(function (ev, key) {
    var _eventsMap$current$ev5, _eventsMap$current$ev6;

    (_eventsMap$current$ev5 = eventsMap.current[ev]) == null ? void 0 : _eventsMap$current$ev5["delete"](key);

    if (((_eventsMap$current$ev6 = eventsMap.current[ev]) == null ? void 0 : _eventsMap$current$ev6.size) === 0) {
      callObject == null ? void 0 : callObject.off(ev, handleEvent);
      delete eventsMap.current[ev];
    }
  }, [callObject, handleEvent]);
  return React.createElement(RecoilRoot, null, React.createElement(DailyContext.Provider, {
    value: callObject
  }, React.createElement(DailyEventContext.Provider, {
    value: {
      on: on,
      off: off
    }
  }, React.createElement(DailyRoom, null, React.createElement(DailyParticipants, null, children)))));
};

/**
 * Returns the participant identified by the given sessionId.
 * @param sessionId – The participant's session_id or "local".
 */

var useParticipant = function useParticipant(sessionId, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      onParticipantLeft = _ref.onParticipantLeft,
      onParticipantUpdated = _ref.onParticipantUpdated;

  var participant = useRecoilValue(participantState(sessionId));
  useThrottledDailyEvent('participant-updated', useCallback(function (evts) {
    var filteredEvts = evts.filter(function (ev) {
      return ev.participant.session_id === sessionId;
    });
    if (!filteredEvts.length) return;
    filteredEvts.forEach(function (ev) {
      setTimeout(function () {
        return onParticipantUpdated == null ? void 0 : onParticipantUpdated(ev);
      }, 0);
    });
  }, [onParticipantUpdated, sessionId]));
  useThrottledDailyEvent('participant-left', useCallback(function (evts) {
    var filteredEvts = evts.filter(function (ev) {
      return ev.participant.session_id === sessionId;
    });
    if (!filteredEvts.length) return; // Last event is sufficient to pass the information

    var ev = evts[evts.length - 1];
    setTimeout(function () {
      return onParticipantLeft == null ? void 0 : onParticipantLeft(ev);
    }, 0);
  }, [onParticipantLeft, sessionId]));
  return participant;
};

/**
 * Stores the most recent peerId as reported from [active-speaker-change](https://docs.daily.co/reference/daily-js/events/meeting-events#active-speaker-change) event.
 */

var activeIdState = /*#__PURE__*/atom({
  key: 'active-id',
  "default": ''
});
/**
 * Returns the most recent participant mentioned in an [active-speaker-change](https://docs.daily.co/reference/daily-js/events/meeting-events#active-speaker-change) event.
 */

var useActiveParticipant = function useActiveParticipant(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$ignoreLocal = _ref.ignoreLocal,
      ignoreLocal = _ref$ignoreLocal === void 0 ? false : _ref$ignoreLocal,
      onActiveSpeakerChange = _ref.onActiveSpeakerChange;

  var daily = useDaily();
  var recentActiveId = useRecoilValue(activeIdState);

  var _useState = useState(''),
      activeId = _useState[0],
      setActiveId = _useState[1];

  var activeParticipant = useParticipant(activeId);
  useEffect(function () {
    var _daily$participants;

    if (!daily) return;
    var local = daily == null ? void 0 : (_daily$participants = daily.participants()) == null ? void 0 : _daily$participants.local;
    if (ignoreLocal && recentActiveId === (local == null ? void 0 : local.session_id)) return;
    setActiveId(recentActiveId);
  }, [daily, ignoreLocal, recentActiveId]);
  useDailyEvent('active-speaker-change', useRecoilCallback(function (_ref2) {
    var set = _ref2.set;
    return function (ev) {
      set(activeIdState, ev.activeSpeaker.peerId);
      setTimeout(function () {
        return onActiveSpeakerChange == null ? void 0 : onActiveSpeakerChange(ev);
      }, 0);
    };
  }, [onActiveSpeakerChange]));
  return activeParticipant;
};

/**
 * React hook to setup [app-message](https://docs.daily.co/reference/daily-js/events/participant-events#app-message) listeners and
 * to send messages via [sendAppMessage](https://docs.daily.co/reference/daily-js/instance-methods/send-app-message).
 */

var useAppMessage = function useAppMessage(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      onAppMessage = _ref.onAppMessage;

  var daily = useDaily();
  var sendAppMessage = useCallback(function (data, to) {
    if (to === void 0) {
      to = '*';
    }

    if (!daily) return;
    daily.sendAppMessage(data, to);
  }, [daily]);
  var handleAppMessage = useCallback(function (ev) {
    onAppMessage == null ? void 0 : onAppMessage(ev, sendAppMessage);
  }, [onAppMessage, sendAppMessage]);
  useDailyEvent('app-message', handleAppMessage);
  return sendAppMessage;
};

var mediaTrackState = /*#__PURE__*/atomFamily({
  key: 'media-track',
  "default": {
    state: 'loading',
    subscribed: false
  }
});
/**
 * Returns a participant's track and state, based on the given MediaType.
 *
 * Equivalent to daily.participants()[participantId].tracks[type].
 *
 * @param participantId The participant's session_id.
 * @param type The track type. Default: "video"
 */

var useMediaTrack = function useMediaTrack(participantId, type) {
  if (type === void 0) {
    type = 'video';
  }

  var daily = useDaily();
  var key = useMemo(function () {
    return participantId + "-" + type;
  }, [participantId, type]);
  var trackState = useRecoilValue(mediaTrackState(key));
  var handleNewParticipantState = useRecoilCallback(function (_ref) {
    var transact_UNSTABLE = _ref.transact_UNSTABLE;
    return function (evts) {
      var filteredEvts = evts.filter(function (ev) {
        return ev.participant.session_id === participantId;
      });
      if (!filteredEvts.length) return;
      transact_UNSTABLE(function (_ref2) {
        var reset = _ref2.reset,
            set = _ref2.set;
        filteredEvts.forEach(function (ev) {
          switch (ev.action) {
            case 'participant-joined':
            case 'participant-updated':
              set(mediaTrackState(key), ev.participant.tracks[type]);
              break;

            case 'participant-left':
              reset(mediaTrackState(key));
              break;
          }
        });
      });
    };
  }, [key, participantId, type]);
  useThrottledDailyEvent('participant-joined', handleNewParticipantState);
  useThrottledDailyEvent('participant-updated', handleNewParticipantState);
  useThrottledDailyEvent('participant-left', handleNewParticipantState);
  useDailyEvent('joined-meeting', useRecoilCallback(function (_ref3) {
    var set = _ref3.set;
    return function (ev) {
      set(mediaTrackState(key), ev.participants.local.tracks[type]);
    };
  }, [key, type]));
  var setInitialState = useRecoilCallback(function (_ref4) {
    var set = _ref4.set;
    return function (initialState) {
      if (!initialState) return;
      set(mediaTrackState(key), initialState);
    };
  }, [key]);
  useEffect(function () {
    var _participant$tracks$t, _participant$tracks;

    if (!daily) return;
    var participants = daily == null ? void 0 : daily.participants();
    if (!participants) return;
    var participant = Object.values(participants).find(function (p) {
      return p.session_id === participantId;
    });
    if (!participant) return;
    setInitialState((_participant$tracks$t = (_participant$tracks = participant.tracks) == null ? void 0 : _participant$tracks[type]) != null ? _participant$tracks$t : null);
  }, [daily, participantId, setInitialState, type]);
  if (!trackState) return {
    isOff: true,
    persistentTrack: undefined,
    state: 'off',
    subscribed: false
  };
  return _extends({}, trackState, {
    isOff: trackState.state === 'blocked' || trackState.state === 'off'
  });
};

/**
 * Returns a participant's audio track and state.
 * @param participantId The participant's session_id.
 */

var useAudioTrack = function useAudioTrack(participantId) {
  return useMediaTrack(participantId, 'audio');
};

var generalCameraState = /*#__PURE__*/atom({
  key: 'general-camera-state',
  "default": 'pending'
});
var generalMicrophoneState = /*#__PURE__*/atom({
  key: 'general-microphone-state',
  "default": 'pending'
});
var cameraDevicesState = /*#__PURE__*/atom({
  key: 'camera-devices',
  "default": []
});
var microphoneDevicesState = /*#__PURE__*/atom({
  key: 'microphone-devices',
  "default": []
});
var speakerDevicesState = /*#__PURE__*/atom({
  key: 'speaker-devices',
  "default": []
});
/**
 * This hook allows access to information about the user's devices and their state.
 */

var useDevices = function useDevices() {
  var daily = useDaily();
  var camState = useRecoilValue(generalCameraState);
  var micState = useRecoilValue(generalMicrophoneState);
  var camDevices = useRecoilValue(cameraDevicesState);
  var micDevices = useRecoilValue(microphoneDevicesState);
  var speakerDevices = useRecoilValue(speakerDevicesState);
  /**
   * Refreshes list of available devices using enumerateDevices.
   * Previous device states are kept in place, otherwise states are initialized as 'granted'.
   */

  var refreshDevices = useRecoilCallback(function (_ref) {
    var transact_UNSTABLE = _ref.transact_UNSTABLE;
    return /*#__PURE__*/_asyncToGenerator(function* () {
      var _navigator, _navigator$mediaDevic, _navigator2, _navigator2$mediaDevi;

      /**
       * Check for legacy browsers.
       */
      if (typeof ((_navigator = navigator) == null ? void 0 : (_navigator$mediaDevic = _navigator.mediaDevices) == null ? void 0 : _navigator$mediaDevic.getUserMedia) === 'undefined' || typeof ((_navigator2 = navigator) == null ? void 0 : (_navigator2$mediaDevi = _navigator2.mediaDevices) == null ? void 0 : _navigator2$mediaDevi.enumerateDevices) === 'undefined') {
        transact_UNSTABLE(function (_ref3) {
          var set = _ref3.set;
          set(generalCameraState, 'not-supported');
          set(generalMicrophoneState, 'not-supported');
        });
        return;
      }

      if (!daily) return;

      try {
        var _yield$daily$enumerat = yield daily.enumerateDevices(),
            devices = _yield$daily$enumerat.devices;
        /**
         * Filter out "empty" devices for when device access has not been granted (yet).
         */


        var cams = devices.filter(function (d) {
          return d.kind === 'videoinput' && d.deviceId !== '';
        });
        var mics = devices.filter(function (d) {
          return d.kind === 'audioinput' && d.deviceId !== '';
        });
        var speakers = devices.filter(function (d) {
          return d.kind === 'audiooutput' && d.deviceId !== '';
        });

        var _yield$daily$getInput = yield daily.getInputDevices(),
            camera = _yield$daily$getInput.camera,
            mic = _yield$daily$getInput.mic,
            speaker = _yield$daily$getInput.speaker;

        var mapDevice = function mapDevice(device, d, prevDevices) {
          var _prevDevices$find$sta, _prevDevices$find;

          return {
            device: d,
            selected: 'deviceId' in device && d.deviceId === device.deviceId,
            state: (_prevDevices$find$sta = (_prevDevices$find = prevDevices.find(function (p) {
              return p.device.deviceId === d.deviceId;
            })) == null ? void 0 : _prevDevices$find.state) != null ? _prevDevices$find$sta : 'granted'
          };
        };

        var sortDeviceByLabel = function sortDeviceByLabel(a, b) {
          if (a.device.deviceId === 'default') return -1;
          if (b.device.deviceId === 'default') return 1;
          if (a.device.label < b.device.label) return -1;
          if (a.device.label > b.device.label) return 1;
          return 0;
        };

        transact_UNSTABLE(function (_ref4) {
          var set = _ref4.set;
          set(cameraDevicesState, function (prevCams) {
            return cams.filter(Boolean).map(function (d) {
              return mapDevice(camera, d, prevCams);
            }).sort(sortDeviceByLabel);
          });
          set(microphoneDevicesState, function (prevMics) {
            return mics.filter(Boolean).map(function (d) {
              return mapDevice(mic, d, prevMics);
            }).sort(sortDeviceByLabel);
          });
          set(speakerDevicesState, function (prevSpeakers) {
            return speakers.filter(Boolean).map(function (d) {
              return mapDevice(speaker, d, prevSpeakers);
            }).sort(sortDeviceByLabel);
          });
        });
      } catch (e) {
        transact_UNSTABLE(function (_ref5) {
          var set = _ref5.set;
          set(generalCameraState, 'not-supported');
          set(generalMicrophoneState, 'not-supported');
        });
      }
    });
  }, [daily]);
  /**
   * Updates general and specific device states, based on blocked status.
   */

  var updateDeviceStates = useRecoilCallback(function (_ref6) {
    var set = _ref6.set,
        snapshot = _ref6.snapshot,
        transact_UNSTABLE = _ref6.transact_UNSTABLE;
    return /*#__PURE__*/_asyncToGenerator(function* () {
      var _tracks$audio, _tracks$audio$blocked, _tracks$audio2, _tracks$audio2$blocke, _tracks$audio3, _tracks$audio3$blocke, _tracks$video, _tracks$video$blocked, _tracks$video2, _tracks$video2$blocke, _tracks$video3, _tracks$video3$blocke;

      if (!daily) return;
      var currentCamState = yield snapshot.getPromise(generalCameraState);
      var currentMicState = yield snapshot.getPromise(generalMicrophoneState);
      var tracks = daily.participants().local.tracks;
      var awaitingCamAccess = currentCamState === 'pending' && tracks.video.state === 'interrupted';
      var awaitingMicAccess = currentMicState === 'pending' && tracks.audio.state === 'interrupted';

      if ((_tracks$audio = tracks.audio) != null && (_tracks$audio$blocked = _tracks$audio.blocked) != null && _tracks$audio$blocked.byDeviceInUse) {
        transact_UNSTABLE(function (_ref8) {
          var set = _ref8.set;
          set(generalMicrophoneState, 'in-use');
          set(microphoneDevicesState, function (mics) {
            return mics.map(function (m) {
              return m.selected ? _extends({}, m, {
                state: 'in-use'
              }) : m;
            });
          });
        });
      } else if ((_tracks$audio2 = tracks.audio) != null && (_tracks$audio2$blocke = _tracks$audio2.blocked) != null && _tracks$audio2$blocke.byDeviceMissing) {
        set(generalMicrophoneState, 'not-found');
      } else if ((_tracks$audio3 = tracks.audio) != null && (_tracks$audio3$blocke = _tracks$audio3.blocked) != null && _tracks$audio3$blocke.byPermissions) {
        set(generalMicrophoneState, 'blocked');
      } else if (!awaitingMicAccess) {
        transact_UNSTABLE(function (_ref9) {
          var set = _ref9.set;
          set(generalMicrophoneState, 'granted');
          set(microphoneDevicesState, function (mics) {
            return mics.map(function (m) {
              return m.selected ? _extends({}, m, {
                state: 'granted'
              }) : m;
            });
          });
        });
      }

      if ((_tracks$video = tracks.video) != null && (_tracks$video$blocked = _tracks$video.blocked) != null && _tracks$video$blocked.byDeviceInUse) {
        transact_UNSTABLE(function (_ref10) {
          var set = _ref10.set;
          set(generalCameraState, 'in-use');
          set(cameraDevicesState, function (cams) {
            return cams.map(function (m) {
              return m.selected ? _extends({}, m, {
                state: 'in-use'
              }) : m;
            });
          });
        });
      } else if ((_tracks$video2 = tracks.video) != null && (_tracks$video2$blocke = _tracks$video2.blocked) != null && _tracks$video2$blocke.byDeviceMissing) {
        set(generalCameraState, 'not-found');
      } else if ((_tracks$video3 = tracks.video) != null && (_tracks$video3$blocke = _tracks$video3.blocked) != null && _tracks$video3$blocke.byPermissions) {
        set(generalCameraState, 'blocked');
      } else if (!awaitingCamAccess) {
        transact_UNSTABLE(function (_ref11) {
          var set = _ref11.set;
          set(generalCameraState, 'granted');
          set(cameraDevicesState, function (cams) {
            return cams.map(function (m) {
              return m.selected ? _extends({}, m, {
                state: 'granted'
              }) : m;
            });
          });
        });
      }

      refreshDevices();
    });
  }, [daily, refreshDevices]);
  useDailyEvent('participant-updated', useCallback(function (ev) {
    if (!ev.participant.local) return;
    updateDeviceStates();
  }, [updateDeviceStates]));
  useDailyEvent('available-devices-updated', refreshDevices);
  useDailyEvent('camera-error', useRecoilCallback(function (_ref12) {
    var set = _ref12.set,
        transact_UNSTABLE = _ref12.transact_UNSTABLE;
    return function (_ref13) {
      var error = _ref13.error,
          _ref13$errorMsg = _ref13.errorMsg,
          audioOk = _ref13$errorMsg.audioOk,
          errorMsg = _ref13$errorMsg.errorMsg,
          videoOk = _ref13$errorMsg.videoOk;

      switch (error == null ? void 0 : error.type) {
        case 'cam-in-use':
          set(generalCameraState, 'in-use');
          break;

        case 'mic-in-use':
          set(generalMicrophoneState, 'in-use');
          break;

        case 'cam-mic-in-use':
          transact_UNSTABLE(function (_ref14) {
            var set = _ref14.set;
            set(generalCameraState, 'in-use');
            set(generalMicrophoneState, 'in-use');
          });
          break;

        default:
          switch (errorMsg) {
            case 'devices error':
              transact_UNSTABLE(function (_ref15) {
                var set = _ref15.set;
                if (!videoOk) set(generalCameraState, 'not-found');
                if (!audioOk) set(generalMicrophoneState, 'not-found');
              });
              break;

            case 'not allowed':
              {
                transact_UNSTABLE(function (_ref16) {
                  var set = _ref16.set;
                  set(generalCameraState, 'blocked');
                  set(generalMicrophoneState, 'blocked');
                });
                updateDeviceStates();
                break;
              }
          }

          break;
      }
    };
  }, [updateDeviceStates]));
  useDailyEvent('error', useRecoilCallback(function (_ref17) {
    var transact_UNSTABLE = _ref17.transact_UNSTABLE;
    return function (_ref18) {
      var errorMsg = _ref18.errorMsg;

      switch (errorMsg) {
        case 'not allowed':
          {
            transact_UNSTABLE(function (_ref19) {
              var set = _ref19.set;
              set(generalCameraState, 'blocked');
              set(generalMicrophoneState, 'blocked');
            });
            updateDeviceStates();
            break;
          }
      }
    };
  }, [updateDeviceStates]));
  /**
   * Update all device state, when camera is started.
   */

  useDailyEvent('started-camera', useRecoilCallback(function (_ref20) {
    var transact_UNSTABLE = _ref20.transact_UNSTABLE;
    return function () {
      transact_UNSTABLE(function (_ref21) {
        var set = _ref21.set;
        set(generalCameraState, 'granted');
        set(generalMicrophoneState, 'granted');
      });
      updateDeviceStates();
    };
  }, [updateDeviceStates]));
  /**
   * Sets video input device to given deviceId.
   */

  var setCamera = useCallback( /*#__PURE__*/function () {
    var _ref22 = _asyncToGenerator(function* (deviceId) {
      yield daily == null ? void 0 : daily.setInputDevicesAsync({
        audioDeviceId: null,
        videoDeviceId: deviceId
      });
      refreshDevices();
    });

    return function (_x) {
      return _ref22.apply(this, arguments);
    };
  }(), [daily, refreshDevices]);
  /**
   * Sets audio input device to given deviceId.
   */

  var setMicrophone = useCallback( /*#__PURE__*/function () {
    var _ref23 = _asyncToGenerator(function* (deviceId) {
      yield daily == null ? void 0 : daily.setInputDevicesAsync({
        audioDeviceId: deviceId,
        videoDeviceId: null
      });
      refreshDevices();
    });

    return function (_x2) {
      return _ref23.apply(this, arguments);
    };
  }(), [daily, refreshDevices]);
  /**
   * Sets audio output device to given deviceId.
   */

  var setSpeaker = useCallback( /*#__PURE__*/function () {
    var _ref24 = _asyncToGenerator(function* (deviceId) {
      yield daily == null ? void 0 : daily.setOutputDeviceAsync({
        outputDeviceId: deviceId
      });
      refreshDevices();
    });

    return function (_x3) {
      return _ref24.apply(this, arguments);
    };
  }(), [daily, refreshDevices]);
  return {
    /**
     * A list of the user's camera (videoinput) devices. See [MediaDeviceInfo](https://developer.mozilla.org/en-US/docs/Web/API/MediaDeviceInfo) for more info.
     */
    cameras: camDevices,

    /**
     * The general state for camera access.
     */
    camState: camState,

    /**
     * Indicates that there's an issue with camera devices.
     */
    hasCamError: ['blocked', 'in-use', 'not-found'].includes(camState),

    /**
     * Indicates that there's an issue with microphone devices.
     */
    hasMicError: ['blocked', 'in-use', 'not-found'].includes(micState),

    /**
     * A list of the user's microphone (audioinput) devices. See [MediaDeviceInfo](https://developer.mozilla.org/en-US/docs/Web/API/MediaDeviceInfo) for more info.
     */
    microphones: micDevices,

    /**
     * The general state for microphone access.
     */
    micState: micState,

    /**
     * Refreshes the list of devices using [enumerateDevices](https://docs.daily.co/reference/daily-js/instance-methods/enumerate-devices).
     */
    refreshDevices: refreshDevices,

    /**
     * Allows to switch to the camera with the specified deviceId. Calls [setInputDevicesAsync](https://docs.daily.co/reference/daily-js/instance-methods/set-input-devices-async) internally.
     */
    setCamera: setCamera,

    /**
     * Allows to switch to the microphone with the specified deviceId. Calls [setInputDevicesAsync](https://docs.daily.co/reference/daily-js/instance-methods/set-input-devices-async) internally.
     */
    setMicrophone: setMicrophone,

    /**
     * Allows to switch to the speaker with the specified deviceId. Calls [setOutputDevice](https://docs.daily.co/reference/daily-js/instance-methods/set-output-device) internally.
     */
    setSpeaker: setSpeaker,

    /**
     * A list of the user's speaker (audiooutput) devices. See [MediaDeviceInfo](https://developer.mozilla.org/en-US/docs/Web/API/MediaDeviceInfo) for more info.
     */
    speakers: speakerDevices
  };
};

var inputSettingsState = /*#__PURE__*/atom({
  key: 'input-settings',
  "default": null
});
var errorState = /*#__PURE__*/atom({
  key: 'input-settings-error',
  "default": null
});
var useInputSettings = function useInputSettings(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      onError = _ref.onError,
      onInputSettingsUpdated = _ref.onInputSettingsUpdated;

  var inputSettings = useRecoilValue(inputSettingsState);
  var errorMsg = useRecoilValue(errorState);
  var daily = useDaily();
  var updateInputSettingsState = useRecoilCallback(function (_ref2) {
    var set = _ref2.set;
    return function (inputSettings) {
      set(inputSettingsState, inputSettings);
    };
  }, []);
  useEffect(function () {
    if (!daily) return;
    daily.getInputSettings().then(updateInputSettingsState);
  }, [daily, updateInputSettingsState]);
  /**
   * Handle 'input-settings-updated' events.
   */

  useDailyEvent('input-settings-updated', useCallback(function (ev) {
    updateInputSettingsState(ev.inputSettings);
    setTimeout(function () {
      return onInputSettingsUpdated == null ? void 0 : onInputSettingsUpdated(ev);
    }, 0);
  }, [onInputSettingsUpdated, updateInputSettingsState]));
  /**
   * Handle nonfatal errors of type 'input-settings-error'.
   */

  useDailyEvent('nonfatal-error', useRecoilCallback(function (_ref3) {
    var set = _ref3.set;
    return function (ev) {
      if (ev.type !== 'input-settings-error') return;
      set(errorState, ev.errorMsg);
      setTimeout(function () {
        return onError == null ? void 0 : onError(ev);
      }, 0);
    };
  }, [onError]));
  /**
   * Calls daily.updateInputSettings internally.
   */

  var updateInputSettings = useCallback(function (inputSettings) {
    daily == null ? void 0 : daily.updateInputSettings(inputSettings);
  }, [daily]);
  return {
    errorMsg: errorMsg,
    inputSettings: inputSettings,
    updateInputSettings: updateInputSettings
  };
};

var liveStreamingState = /*#__PURE__*/atom({
  key: 'live-streaming',
  "default": {
    errorMsg: undefined,
    isLiveStreaming: false,
    layout: undefined
  }
});
/**
 * This hook allows to setup [live streaming events](https://docs.daily.co/reference/daily-js/events/live-streaming-events),
 * as well as starting, stopping and updating live streams.
 *
 * Returns the current live streaming state, incl. the current layout and potential errorMsg.
 */

var useLiveStreaming = function useLiveStreaming(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      onLiveStreamingError = _ref.onLiveStreamingError,
      onLiveStreamingStarted = _ref.onLiveStreamingStarted,
      onLiveStreamingStopped = _ref.onLiveStreamingStopped;

  var daily = useDaily();
  var state = useRecoilValue(liveStreamingState);
  useDailyEvent('live-streaming-started', useRecoilCallback(function (_ref2) {
    var set = _ref2.set;
    return function (ev) {
      set(liveStreamingState, {
        isLiveStreaming: true,
        layout: ev == null ? void 0 : ev.layout
      });
      setTimeout(function () {
        return onLiveStreamingStarted == null ? void 0 : onLiveStreamingStarted(ev);
      }, 0);
    };
  }, [onLiveStreamingStarted]));
  useDailyEvent('live-streaming-stopped', useRecoilCallback(function (_ref3) {
    var set = _ref3.set;
    return function (ev) {
      set(liveStreamingState, function (prevState) {
        return _extends({}, prevState, {
          isLiveStreaming: false,
          layout: undefined
        });
      });
      setTimeout(function () {
        return onLiveStreamingStopped == null ? void 0 : onLiveStreamingStopped(ev);
      }, 0);
    };
  }, [onLiveStreamingStopped]));
  useDailyEvent('live-streaming-error', useRecoilCallback(function (_ref4) {
    var set = _ref4.set;
    return function (ev) {
      set(liveStreamingState, function (prevState) {
        return _extends({}, prevState, {
          errorMsg: ev.errorMsg
        });
      });
      setTimeout(function () {
        return onLiveStreamingError == null ? void 0 : onLiveStreamingError(ev);
      }, 0);
    };
  }, [onLiveStreamingError]));
  var startLiveStreaming = useCallback(function (options) {
    if (!daily) return;
    daily.startLiveStreaming(options);
  }, [daily]);
  var stopLiveStreaming = useCallback(function () {
    if (!daily) return;
    daily.stopLiveStreaming();
  }, [daily]);
  var updateLiveStreaming = useCallback(function (_ref5) {
    var layout = _ref5.layout;
    if (!daily) return;
    daily.updateLiveStreaming({
      layout: layout
    });
  }, [daily]);
  return _extends({}, state, {
    startLiveStreaming: startLiveStreaming,
    stopLiveStreaming: stopLiveStreaming,
    updateLiveStreaming: updateLiveStreaming
  });
};

/**
 * Returns the [participants() object](https://docs.daily.co/reference/daily-js/instance-methods/participants) for the local user.
 */

var useLocalParticipant = function useLocalParticipant() {
  var localId = useRecoilValue(localIdState);
  return useParticipant(localId);
};

/**
 * Returns the local participant's session_id or null,
 * if the local participant doesn't exist.
 */

var useLocalSessionId = function useLocalSessionId() {
  return useRecoilValue(localIdState) || null;
};

var topologyState = /*#__PURE__*/atom({
  key: 'topology',
  "default": 'peer'
});
var networkQualityState = /*#__PURE__*/atom({
  key: 'networkQuality',
  "default": 100
});
var networkThresholdState = /*#__PURE__*/atom({
  key: 'networkThreshold',
  "default": 'good'
});
/**
 * Returns current information about network quality and topology.
 * Allows to setup event listeners for daily's [network events](https://docs.daily.co/reference/daily-js/events/network-events).
 */

var useNetwork = function useNetwork(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      onNetworkConnection = _ref.onNetworkConnection,
      onNetworkQualityChange = _ref.onNetworkQualityChange;

  var daily = useDaily();
  var topology = useRecoilValue(topologyState);
  var quality = useRecoilValue(networkQualityState);
  var threshold = useRecoilValue(networkThresholdState);
  var handleNetworkConnection = useRecoilCallback(function (_ref2) {
    var transact_UNSTABLE = _ref2.transact_UNSTABLE;
    return function (ev) {
      transact_UNSTABLE(function (_ref3) {
        var set = _ref3.set;

        switch (ev.event) {
          case 'connected':
            if (ev.type === 'peer-to-peer') set(topologyState, 'peer');
            if (ev.type === 'sfu') set(topologyState, 'sfu');
            break;
        }
      });
      setTimeout(function () {
        return onNetworkConnection == null ? void 0 : onNetworkConnection(ev);
      }, 0);
    };
  }, [onNetworkConnection]);
  var handleNetworkQualityChange = useRecoilCallback(function (_ref4) {
    var transact_UNSTABLE = _ref4.transact_UNSTABLE;
    return function (ev) {
      transact_UNSTABLE(function (_ref5) {
        var set = _ref5.set;
        set(networkQualityState, function (prevQuality) {
          return prevQuality !== ev.quality ? ev.quality : prevQuality;
        });
        set(networkThresholdState, function (prevThreshold) {
          return prevThreshold !== ev.threshold ? ev.threshold : prevThreshold;
        });
      });
      setTimeout(function () {
        return onNetworkQualityChange == null ? void 0 : onNetworkQualityChange(ev);
      }, 0);
    };
  }, [onNetworkQualityChange]);
  useDailyEvent('network-connection', handleNetworkConnection);
  useDailyEvent('network-quality-change', handleNetworkQualityChange);
  var getStats = useCallback( /*#__PURE__*/_asyncToGenerator(function* () {
    var newStats = yield daily == null ? void 0 : daily.getNetworkStats();
    return newStats == null ? void 0 : newStats.stats;
  }), [daily]);
  return {
    getStats: getStats,
    quality: quality,
    threshold: threshold,
    topology: topology
  };
};

var defaultFilter = Boolean;

var defaultSort = function defaultSort() {
  return 0;
};
/**
 * Returns a list of participant ids (= session_id).
 * The list can optionally be filtered and sorted, using the filter and sort options.
 */


var useParticipantIds = function useParticipantIds(_temp) {
  var _ref = _temp === void 0 ? {
    filter: defaultFilter,
    sort: defaultSort
  } : _temp,
      _ref$filter = _ref.filter,
      filter = _ref$filter === void 0 ? defaultFilter : _ref$filter,
      onActiveSpeakerChange = _ref.onActiveSpeakerChange,
      onParticipantJoined = _ref.onParticipantJoined,
      onParticipantLeft = _ref.onParticipantLeft,
      onParticipantUpdated = _ref.onParticipantUpdated,
      _ref$sort = _ref.sort,
      sort = _ref$sort === void 0 ? defaultSort : _ref$sort;

  var allParticipants = useRecoilValue(participantsState);
  var sortedIds = useMemo(function () {
    var filterFn = defaultFilter;

    switch (filter) {
      case 'local':
        filterFn = function filterFn(p) {
          return p.local;
        };

        break;

      case 'owner':
        filterFn = function filterFn(p) {
          return p.owner;
        };

        break;

      case 'record':
        filterFn = function filterFn(p) {
          return p.record;
        };

        break;

      case 'remote':
        filterFn = function filterFn(p) {
          return !p.local;
        };

        break;

      case 'screen':
        filterFn = function filterFn(p) {
          return p.screen;
        };

        break;

      default:
        filterFn = filter;
    }

    var sortFn;

    switch (sort) {
      case 'joined_at':
      case 'session_id':
      case 'user_id':
      case 'user_name':
        sortFn = function sortFn(a, b) {
          if (a[sort] < b[sort]) return -1;
          if (a[sort] > b[sort]) return 1;
          return 0;
        };

        break;

      default:
        sortFn = sort;
        break;
    }

    return allParticipants.filter(filterFn).sort(sortFn).map(function (p) {
      return p.session_id;
    }).filter(Boolean);
  }, [allParticipants, filter, sort]);
  useThrottledDailyEvent('participant-joined', useCallback(function (evts) {
    if (!evts.length) return;
    evts.forEach(function (ev) {
      return setTimeout(function () {
        return onParticipantJoined == null ? void 0 : onParticipantJoined(ev);
      }, 0);
    });
  }, [onParticipantJoined]));
  useThrottledDailyEvent('participant-updated', useCallback(function (evts) {
    if (!evts.length) return;
    evts.forEach(function (ev) {
      return setTimeout(function () {
        return onParticipantUpdated == null ? void 0 : onParticipantUpdated(ev);
      }, 0);
    });
  }, [onParticipantUpdated]));
  useThrottledDailyEvent('active-speaker-change', useCallback( /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(function* (evts) {
      if (!evts.length) return;
      evts.forEach(function (ev) {
        return setTimeout(function () {
          return onActiveSpeakerChange == null ? void 0 : onActiveSpeakerChange(ev);
        }, 0);
      });
    });

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }(), [onActiveSpeakerChange]));
  useThrottledDailyEvent('participant-left', useCallback(function (evts) {
    if (!evts.length) return;
    evts.forEach(function (ev) {
      return setTimeout(function () {
        return onParticipantLeft == null ? void 0 : onParticipantLeft(ev);
      }, 0);
    });
  }, [onParticipantLeft]));
  return sortedIds;
};

/**
 * Returns a participant's property that you subscribe to.
 * @param participantId The participant's session_id.
 * @param propertyPath the participant property that you want to subscribe to.
 */

var useParticipantProperty = function useParticipantProperty(participantId, propertyPath) {
  return useRecoilValue(participantPropertyState({
    id: participantId,
    property: propertyPath
  }));
};

var participantReceiveSettingsState = /*#__PURE__*/atomFamily({
  key: 'participant-receive-settings',
  "default": {}
});
/**
 * Allows to read and set receiveSettings.
 * In case receiveSettings for participant specified by id are empty, not set or 'inherit',
 * base receiveSettings will be returned.
 * In case meeting is not in joined state, calls to updateReceiveSettings will be silently ignored.
 */

var useReceiveSettings = function useReceiveSettings(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$id = _ref.id,
      id = _ref$id === void 0 ? 'base' : _ref$id,
      onReceiveSettingsUpdated = _ref.onReceiveSettingsUpdated;

  var baseSettings = useRecoilValue(participantReceiveSettingsState('base'));
  var receiveSettings = useRecoilValue(participantReceiveSettingsState(id));
  var daily = useDaily();
  useDailyEvent('receive-settings-updated', useRecoilCallback(function (_ref2) {
    var transact_UNSTABLE = _ref2.transact_UNSTABLE;
    return function (ev) {
      transact_UNSTABLE(function (_ref3) {
        var reset = _ref3.reset,
            set = _ref3.set;

        var ids = _extends({}, ev.receiveSettings);

        for (var _i = 0, _Object$entries = Object.entries(ids); _i < _Object$entries.length; _i++) {
          var _Object$entries$_i = _Object$entries[_i],
              _id = _Object$entries$_i[0],
              settings = _Object$entries$_i[1];
          set(participantReceiveSettingsState(_id), settings);
        }

        if (!(id in ids)) {
          reset(participantReceiveSettingsState(id));
        }
      });
      setTimeout(function () {
        return onReceiveSettingsUpdated == null ? void 0 : onReceiveSettingsUpdated(ev);
      }, 0);
    };
  }, [id, onReceiveSettingsUpdated]));
  var updateReceiveSettings = useCallback(function (receiveSettings) {
    if (!(daily && daily.meetingState() === 'joined-meeting')) {
      return;
    }

    daily == null ? void 0 : daily.updateReceiveSettings == null ? void 0 : daily.updateReceiveSettings(receiveSettings);
  }, [daily]);
  return {
    receiveSettings: id === 'base' || Object.keys(receiveSettings).length === 0 ? baseSettings : receiveSettings,
    updateReceiveSettings: updateReceiveSettings
  };
};

var recordingState = /*#__PURE__*/atom({
  key: 'recording',
  "default": {
    isLocalParticipantRecorded: false,
    isRecording: false
  }
});
var useRecording = function useRecording(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      onRecordingData = _ref.onRecordingData,
      onRecordingError = _ref.onRecordingError,
      onRecordingStarted = _ref.onRecordingStarted,
      onRecordingStopped = _ref.onRecordingStopped;

  var daily = useDaily();
  var state = useRecoilValue(recordingState);
  var setState = useSetRecoilState(recordingState);
  var localSessionId = useLocalSessionId();
  var recordingParticipantIds = useParticipantIds({
    filter: 'record'
  });
  /**
   * Update recording state, whenever amount of recording participants changes.
   */

  useEffect(function () {
    var hasRecordingParticipants = recordingParticipantIds.length > 0;
    var isLocalParticipantRecording = recordingParticipantIds.includes(localSessionId != null ? localSessionId : 'local');
    setState(function (s) {
      return _extends({}, s, {
        // In case type is local or not set, determine based on recording participants
        isLocalParticipantRecorded: (s == null ? void 0 : s.type) === 'local' || !(s != null && s.type) ? hasRecordingParticipants : s.isLocalParticipantRecorded,
        isRecording: (s == null ? void 0 : s.type) === 'local' || !(s != null && s.type) ? hasRecordingParticipants : s.isRecording,
        local: ((s == null ? void 0 : s.type) === 'local' || !(s != null && s.type)) && hasRecordingParticipants ? isLocalParticipantRecording : s == null ? void 0 : s.local,

        /**
         * Set type in case recording participants are detected.
         * We only set `record` on participants, when recording type is 'local'.
         */
        type: hasRecordingParticipants ? 'local' : s == null ? void 0 : s.type
      });
    });
  }, [localSessionId, recordingParticipantIds, setState]);
  useDailyEvent('recording-started', useRecoilCallback(function (_ref2) {
    var set = _ref2.set;
    return function (ev) {
      var isLocalParticipantRecorded = true;

      switch (ev.type) {
        case 'cloud-beta':
        case 'cloud':
          {
            var _ev$layout;

            if (localSessionId && ((_ev$layout = ev.layout) == null ? void 0 : _ev$layout.preset) === 'single-participant' && ev.layout.session_id !== localSessionId) {
              isLocalParticipantRecorded = false;
            }

            break;
          }
      }

      set(recordingState, {
        error: false,
        isLocalParticipantRecorded: isLocalParticipantRecorded,
        isRecording: true,
        layout: ev == null ? void 0 : ev.layout,
        local: ev == null ? void 0 : ev.local,
        recordingId: ev == null ? void 0 : ev.recordingId,
        recordingStartedDate: new Date(),
        startedBy: ev == null ? void 0 : ev.startedBy,
        type: ev == null ? void 0 : ev.type
      });
      setTimeout(function () {
        return onRecordingStarted == null ? void 0 : onRecordingStarted(ev);
      }, 0);
    };
  }, [localSessionId, onRecordingStarted]));
  useDailyEvent('recording-stopped', useRecoilCallback(function (_ref3) {
    var set = _ref3.set;
    return function (ev) {
      set(recordingState, function (prevState) {
        return _extends({}, prevState, {
          isLocalParticipantRecorded: false,
          isRecording: false
        });
      });
      setTimeout(function () {
        return onRecordingStopped == null ? void 0 : onRecordingStopped(ev);
      }, 0);
    };
  }, [onRecordingStopped]));
  useDailyEvent('recording-error', useRecoilCallback(function (_ref4) {
    var set = _ref4.set;
    return function (ev) {
      set(recordingState, function (prevState) {
        return _extends({}, prevState, {
          error: true,
          isLocalParticipantRecorded: false,
          isRecording: false
        });
      });
      setTimeout(function () {
        return onRecordingError == null ? void 0 : onRecordingError(ev);
      }, 0);
    };
  }, [onRecordingError]));
  useDailyEvent('recording-data', useCallback(function (ev) {
    onRecordingData == null ? void 0 : onRecordingData(ev);
  }, [onRecordingData]));
  /**
   * Starts the recording with the given optional options.
   */

  var startRecording = useCallback(function (options) {
    if (!daily) return;
    daily.startRecording(options);
  }, [daily]);
  /**
   * Stops a recording.
   */

  var stopRecording = useCallback(function () {
    if (!daily) return;
    daily.stopRecording();
  }, [daily]);
  /**
   * Updates a running recording's layout configuration.
   */

  var updateRecording = useCallback(function (options) {
    if (!daily) return;
    daily.updateRecording(options);
  }, [daily]);
  return _extends({}, state, {
    startRecording: startRecording,
    stopRecording: stopRecording,
    updateRecording: updateRecording
  });
};

/**
 * Stateful hook to work with room, domain and token configuration for a daily room.
 * Includes room default values.
 */

var useRoom = function useRoom() {
  var room = useRecoilValue(roomState);
  return room;
};

/**
 * Returns a participant's screenAudio track and state.
 * @param participantId The participant's session_id.
 */

var useScreenAudioTrack = function useScreenAudioTrack(participantId) {
  return useMediaTrack(participantId, 'screenAudio');
};

/**
 * Allows access to information about shared screens, and methods to start or stop a local screen share.
 */

var useScreenShare = function useScreenShare(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      onLocalScreenShareStarted = _ref.onLocalScreenShareStarted,
      onLocalScreenShareStopped = _ref.onLocalScreenShareStopped;

  var daily = useDaily();
  var startScreenShare = useCallback(function (captureOptions) {
    daily == null ? void 0 : daily.startScreenShare(captureOptions);
  }, [daily]);
  var stopScreenShare = useCallback(function () {
    daily == null ? void 0 : daily.stopScreenShare();
  }, [daily]);
  useDailyEvent('local-screen-share-started', useCallback(function () {
    return onLocalScreenShareStarted == null ? void 0 : onLocalScreenShareStarted();
  }, [onLocalScreenShareStarted]));
  useDailyEvent('local-screen-share-stopped', useCallback(function () {
    return onLocalScreenShareStopped == null ? void 0 : onLocalScreenShareStopped();
  }, [onLocalScreenShareStopped]));
  var screenIds = useParticipantIds({
    filter: 'screen'
  });
  var screens = useMemo(function () {
    return screenIds.map(function (id) {
      var _daily$participants;

      var participants = Object.values((_daily$participants = daily == null ? void 0 : daily.participants == null ? void 0 : daily.participants()) != null ? _daily$participants : {});
      var p = participants.find(function (p) {
        return p.session_id === id;
      });
      if (!p) return;
      return {
        local: p.local,
        screenAudio: p.tracks.screenAudio,
        screenVideo: p.tracks.screenVideo,
        screenId: id + "-screen",
        session_id: id
      };
    })
    /**
     * We'll need a type predicate to fully convince TypeScript that this array
     * can't contain undefined. Find a good quick intro about type predicates at:
     * https://fettblog.eu/typescript-type-predicates/
     */
    .filter(function (p) {
      return !!p;
    });
  }, [daily, screenIds]);
  return {
    isSharingScreen: screens.some(function (s) {
      return s.local;
    }),
    screens: screens,
    startScreenShare: startScreenShare,
    stopScreenShare: stopScreenShare
  };
};

/**
 * Returns a participant's screenVideo track and state.
 * @param participantId The participant's session_id.
 */

var useScreenVideoTrack = function useScreenVideoTrack(participantId) {
  return useMediaTrack(participantId, 'screenVideo');
};

/**
 * Returns a participant's video track and state.
 * @param participantId The participant's session_id.
 */

var useVideoTrack = function useVideoTrack(participantId) {
  return useMediaTrack(participantId, 'video');
};

var waitingParticipantsState = /*#__PURE__*/atom({
  key: 'waiting-participants',
  "default": []
});
var waitingParticipantState = /*#__PURE__*/atomFamily({
  key: 'waiting-participant',
  "default": {
    awaitingAccess: {
      level: 'full'
    },
    id: '',
    name: ''
  }
});
var allWaitingParticipantsSelector = /*#__PURE__*/selector({
  key: 'waitingParticipantsSelector',
  get: function get(_ref) {
    var _get = _ref.get;

    var ids = _get(waitingParticipantsState);

    return ids.map(function (id) {
      return _get(waitingParticipantState(id));
    });
  }
});
/**
 * Hook to access and manage waiting participants.
 */

var useWaitingParticipants = function useWaitingParticipants(_temp) {
  var _ref2 = _temp === void 0 ? {} : _temp,
      onWaitingParticipantAdded = _ref2.onWaitingParticipantAdded,
      onWaitingParticipantRemoved = _ref2.onWaitingParticipantRemoved,
      onWaitingParticipantUpdated = _ref2.onWaitingParticipantUpdated;

  var daily = useDaily();
  var waitingParticipants = useRecoilValue(allWaitingParticipantsSelector);
  var handleAdded = useRecoilCallback(function (_ref3) {
    var transact_UNSTABLE = _ref3.transact_UNSTABLE;
    return function (ev) {
      transact_UNSTABLE(function (_ref4) {
        var set = _ref4.set;
        set(waitingParticipantsState, function (wps) {
          if (!wps.includes(ev.participant.id)) {
            return [].concat(wps, [ev.participant.id]);
          }

          return wps;
        });
        set(waitingParticipantState(ev.participant.id), ev.participant);
      });
      setTimeout(function () {
        return onWaitingParticipantAdded == null ? void 0 : onWaitingParticipantAdded(ev);
      }, 0);
    };
  }, [onWaitingParticipantAdded]);
  var handleRemoved = useRecoilCallback(function (_ref5) {
    var transact_UNSTABLE = _ref5.transact_UNSTABLE;
    return function (ev) {
      transact_UNSTABLE(function (_ref6) {
        var reset = _ref6.reset,
            set = _ref6.set;
        set(waitingParticipantsState, function (wps) {
          return wps.filter(function (wp) {
            return wp !== ev.participant.id;
          });
        });
        reset(waitingParticipantState(ev.participant.id));
      });
      setTimeout(function () {
        return onWaitingParticipantRemoved == null ? void 0 : onWaitingParticipantRemoved(ev);
      }, 0);
    };
  }, [onWaitingParticipantRemoved]);
  var handleUpdated = useRecoilCallback(function (_ref7) {
    var set = _ref7.set;
    return function (ev) {
      set(waitingParticipantState(ev.participant.id), ev.participant);
      setTimeout(function () {
        return onWaitingParticipantUpdated == null ? void 0 : onWaitingParticipantUpdated(ev);
      }, 0);
    };
  }, [onWaitingParticipantUpdated]);
  useDailyEvent('waiting-participant-added', handleAdded);
  useDailyEvent('waiting-participant-removed', handleRemoved);
  useDailyEvent('waiting-participant-updated', handleUpdated);
  var updateWaitingParticipantAccess = useCallback(function (id, grantRequestedAccess) {
    if (id === '*') {
      daily == null ? void 0 : daily.updateWaitingParticipants({
        '*': {
          grantRequestedAccess: grantRequestedAccess
        }
      });
      return;
    }

    daily == null ? void 0 : daily.updateWaitingParticipant(id, {
      grantRequestedAccess: grantRequestedAccess
    });
  }, [daily]);
  var grantAccess = useCallback(function (id) {
    updateWaitingParticipantAccess(id, true);
  }, [updateWaitingParticipantAccess]);
  var denyAccess = useCallback(function (id) {
    updateWaitingParticipantAccess(id, false);
  }, [updateWaitingParticipantAccess]);
  return {
    waitingParticipants: waitingParticipants,
    grantAccess: grantAccess,
    denyAccess: denyAccess
  };
};

export { DailyProvider, useActiveParticipant, useAppMessage, useAudioTrack, useDaily, useDailyEvent, useDevices, useInputSettings, useLiveStreaming, useLocalParticipant, useLocalSessionId, useMediaTrack, useNetwork, useParticipant, useParticipantIds, useParticipantProperty, useReceiveSettings, useRecording, useRoom, useScreenAudioTrack, useScreenShare, useScreenVideoTrack, useThrottledDailyEvent, useVideoTrack, useWaitingParticipants };
//# sourceMappingURL=daily-react-hooks.esm.js.map
