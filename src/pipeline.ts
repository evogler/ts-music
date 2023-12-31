type Pipeline = {
  <T0, T1>(initial: T0, ...fns: [(t0: T0) => T1]): T1;
  <T0, T1, T2>(initial: T0, ...fns: [(t0: T0) => T1, (t1: T1) => T2]): T2;
  <T0, T1, T2, T3>(initial: T0, ...fns: [(t0: T0) => T1, (t1: T1) => T2, (t2: T2) => T3]): T3;
  <T0, T1, T2, T3, T4>(
    initial: T0,
    ...fns: [(t0: T0) => T1, (t1: T1) => T2, (t2: T2) => T3, (t3: T3) => T4]
  ): T4;
  <T0, T1, T2, T3, T4, T5>(
    initial: T0,
    ...fns: [(t0: T0) => T1, (t1: T1) => T2, (t2: T2) => T3, (t3: T3) => T4, (t4: T4) => T5]
  ): T5;
  <T0, T1, T2, T3, T4, T5, T6>(
    initial: T0,
    ...fns: [
      (t0: T0) => T1,
      (t1: T1) => T2,
      (t2: T2) => T3,
      (t3: T3) => T4,
      (t4: T4) => T5,
      (t5: T5) => T6,
    ]
  ): T6;
  <T0, T1, T2, T3, T4, T5, T6, T7>(
    initial: T0,
    ...fns: [
      (t0: T0) => T1,
      (t1: T1) => T2,
      (t2: T2) => T3,
      (t3: T3) => T4,
      (t4: T4) => T5,
      (t5: T5) => T6,
      (t6: T6) => T7,
    ]
  ): T7;
  <T0, T1, T2, T3, T4, T5, T6, T7, T8>(
    initial: T0,
    ...fns: [
      (t0: T0) => T1,
      (t1: T1) => T2,
      (t2: T2) => T3,
      (t3: T3) => T4,
      (t4: T4) => T5,
      (t5: T5) => T6,
      (t6: T6) => T7,
      (t7: T7) => T8,
    ]
  ): T8;
  <T0, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    initial: T0,
    ...fns: [
      (t0: T0) => T1,
      (t1: T1) => T2,
      (t2: T2) => T3,
      (t3: T3) => T4,
      (t4: T4) => T5,
      (t5: T5) => T6,
      (t6: T6) => T7,
      (t7: T7) => T8,
      (t8: T8) => T9,
    ]
  ): T9;
  <T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
    initial: T0,
    ...fns: [
      (t0: T0) => T1,
      (t1: T1) => T2,
      (t2: T2) => T3,
      (t3: T3) => T4,
      (t4: T4) => T5,
      (t5: T5) => T6,
      (t6: T6) => T7,
      (t7: T7) => T8,
      (t8: T8) => T9,
      (t9: T9) => T10,
    ]
  ): T10;
  <T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(
    initial: T0,
    ...fns: [
      (t0: T0) => T1,
      (t1: T1) => T2,
      (t2: T2) => T3,
      (t3: T3) => T4,
      (t4: T4) => T5,
      (t5: T5) => T6,
      (t6: T6) => T7,
      (t7: T7) => T8,
      (t8: T8) => T9,
      (t9: T9) => T10,
      (t10: T10) => T11,
    ]
  ): T11;
  <T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(
    initial: T0,
    ...fns: [
      (t0: T0) => T1,
      (t1: T1) => T2,
      (t2: T2) => T3,
      (t3: T3) => T4,
      (t4: T4) => T5,
      (t5: T5) => T6,
      (t6: T6) => T7,
      (t7: T7) => T8,
      (t8: T8) => T9,
      (t9: T9) => T10,
      (t10: T10) => T11,
      (t11: T11) => T12,
    ]
  ): T12;
  <T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13>(
    initial: T0,
    ...fns: [
      (t0: T0) => T1,
      (t1: T1) => T2,
      (t2: T2) => T3,
      (t3: T3) => T4,
      (t4: T4) => T5,
      (t5: T5) => T6,
      (t6: T6) => T7,
      (t7: T7) => T8,
      (t8: T8) => T9,
      (t9: T9) => T10,
      (t10: T10) => T11,
      (t11: T11) => T12,
      (t12: T12) => T13,
    ]
  ): T13;
  <T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14>(
    initial: T0,
    ...fns: [
      (t0: T0) => T1,
      (t1: T1) => T2,
      (t2: T2) => T3,
      (t3: T3) => T4,
      (t4: T4) => T5,
      (t5: T5) => T6,
      (t6: T6) => T7,
      (t7: T7) => T8,
      (t8: T8) => T9,
      (t9: T9) => T10,
      (t10: T10) => T11,
      (t11: T11) => T12,
      (t12: T12) => T13,
      (t13: T13) => T14,
    ]
  ): T14;
  <T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15>(
    initial: T0,
    ...fns: [
      (t0: T0) => T1,
      (t1: T1) => T2,
      (t2: T2) => T3,
      (t3: T3) => T4,
      (t4: T4) => T5,
      (t5: T5) => T6,
      (t6: T6) => T7,
      (t7: T7) => T8,
      (t8: T8) => T9,
      (t9: T9) => T10,
      (t10: T10) => T11,
      (t11: T11) => T12,
      (t12: T12) => T13,
      (t13: T13) => T14,
      (t14: T14) => T15,
    ]
  ): T15;
  <T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16>(
    initial: T0,
    ...fns: [
      (t0: T0) => T1,
      (t1: T1) => T2,
      (t2: T2) => T3,
      (t3: T3) => T4,
      (t4: T4) => T5,
      (t5: T5) => T6,
      (t6: T6) => T7,
      (t7: T7) => T8,
      (t8: T8) => T9,
      (t9: T9) => T10,
      (t10: T10) => T11,
      (t11: T11) => T12,
      (t12: T12) => T13,
      (t13: T13) => T14,
      (t14: T14) => T15,
      (t15: T15) => T16,
    ]
  ): T16;
  <T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17>(
    initial: T0,
    ...fns: [
      (t0: T0) => T1,
      (t1: T1) => T2,
      (t2: T2) => T3,
      (t3: T3) => T4,
      (t4: T4) => T5,
      (t5: T5) => T6,
      (t6: T6) => T7,
      (t7: T7) => T8,
      (t8: T8) => T9,
      (t9: T9) => T10,
      (t10: T10) => T11,
      (t11: T11) => T12,
      (t12: T12) => T13,
      (t13: T13) => T14,
      (t14: T14) => T15,
      (t15: T15) => T16,
      (t16: T16) => T17,
    ]
  ): T17;
  <T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18>(
    initial: T0,
    ...fns: [
      (t0: T0) => T1,
      (t1: T1) => T2,
      (t2: T2) => T3,
      (t3: T3) => T4,
      (t4: T4) => T5,
      (t5: T5) => T6,
      (t6: T6) => T7,
      (t7: T7) => T8,
      (t8: T8) => T9,
      (t9: T9) => T10,
      (t10: T10) => T11,
      (t11: T11) => T12,
      (t12: T12) => T13,
      (t13: T13) => T14,
      (t14: T14) => T15,
      (t15: T15) => T16,
      (t16: T16) => T17,
      (t17: T17) => T18,
    ]
  ): T18;
  <T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19>(
    initial: T0,
    ...fns: [
      (t0: T0) => T1,
      (t1: T1) => T2,
      (t2: T2) => T3,
      (t3: T3) => T4,
      (t4: T4) => T5,
      (t5: T5) => T6,
      (t6: T6) => T7,
      (t7: T7) => T8,
      (t8: T8) => T9,
      (t9: T9) => T10,
      (t10: T10) => T11,
      (t11: T11) => T12,
      (t12: T12) => T13,
      (t13: T13) => T14,
      (t14: T14) => T15,
      (t15: T15) => T16,
      (t16: T16) => T17,
      (t17: T17) => T18,
      (t18: T18) => T19,
    ]
  ): T19;
  <T0, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, T20>(
    initial: T0,
    ...fns: [
      (t0: T0) => T1,
      (t1: T1) => T2,
      (t2: T2) => T3,
      (t3: T3) => T4,
      (t4: T4) => T5,
      (t5: T5) => T6,
      (t6: T6) => T7,
      (t7: T7) => T8,
      (t8: T8) => T9,
      (t9: T9) => T10,
      (t10: T10) => T11,
      (t11: T11) => T12,
      (t12: T12) => T13,
      (t13: T13) => T14,
      (t14: T14) => T15,
      (t15: T15) => T16,
      (t16: T16) => T17,
      (t17: T17) => T18,
      (t18: T18) => T19,
      (t19: T19) => T20,
    ]
  ): T20;
  <
    T0,
    T1,
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
    T8,
    T9,
    T10,
    T11,
    T12,
    T13,
    T14,
    T15,
    T16,
    T17,
    T18,
    T19,
    T20,
    T21,
  >(
    initial: T0,
    ...fns: [
      (t0: T0) => T1,
      (t1: T1) => T2,
      (t2: T2) => T3,
      (t3: T3) => T4,
      (t4: T4) => T5,
      (t5: T5) => T6,
      (t6: T6) => T7,
      (t7: T7) => T8,
      (t8: T8) => T9,
      (t9: T9) => T10,
      (t10: T10) => T11,
      (t11: T11) => T12,
      (t12: T12) => T13,
      (t13: T13) => T14,
      (t14: T14) => T15,
      (t15: T15) => T16,
      (t16: T16) => T17,
      (t17: T17) => T18,
      (t18: T18) => T19,
      (t19: T19) => T20,
      (t20: T20) => T21,
    ]
  ): T21;
  <
    T0,
    T1,
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
    T8,
    T9,
    T10,
    T11,
    T12,
    T13,
    T14,
    T15,
    T16,
    T17,
    T18,
    T19,
    T20,
    T21,
    T22,
  >(
    initial: T0,
    ...fns: [
      (t0: T0) => T1,
      (t1: T1) => T2,
      (t2: T2) => T3,
      (t3: T3) => T4,
      (t4: T4) => T5,
      (t5: T5) => T6,
      (t6: T6) => T7,
      (t7: T7) => T8,
      (t8: T8) => T9,
      (t9: T9) => T10,
      (t10: T10) => T11,
      (t11: T11) => T12,
      (t12: T12) => T13,
      (t13: T13) => T14,
      (t14: T14) => T15,
      (t15: T15) => T16,
      (t16: T16) => T17,
      (t17: T17) => T18,
      (t18: T18) => T19,
      (t19: T19) => T20,
      (t20: T20) => T21,
      (t21: T21) => T22,
    ]
  ): T22;
  <
    T0,
    T1,
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
    T8,
    T9,
    T10,
    T11,
    T12,
    T13,
    T14,
    T15,
    T16,
    T17,
    T18,
    T19,
    T20,
    T21,
    T22,
    T23,
  >(
    initial: T0,
    ...fns: [
      (t0: T0) => T1,
      (t1: T1) => T2,
      (t2: T2) => T3,
      (t3: T3) => T4,
      (t4: T4) => T5,
      (t5: T5) => T6,
      (t6: T6) => T7,
      (t7: T7) => T8,
      (t8: T8) => T9,
      (t9: T9) => T10,
      (t10: T10) => T11,
      (t11: T11) => T12,
      (t12: T12) => T13,
      (t13: T13) => T14,
      (t14: T14) => T15,
      (t15: T15) => T16,
      (t16: T16) => T17,
      (t17: T17) => T18,
      (t18: T18) => T19,
      (t19: T19) => T20,
      (t20: T20) => T21,
      (t21: T21) => T22,
      (t22: T22) => T23,
    ]
  ): T23;
  <
    T0,
    T1,
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
    T8,
    T9,
    T10,
    T11,
    T12,
    T13,
    T14,
    T15,
    T16,
    T17,
    T18,
    T19,
    T20,
    T21,
    T22,
    T23,
    T24,
  >(
    initial: T0,
    ...fns: [
      (t0: T0) => T1,
      (t1: T1) => T2,
      (t2: T2) => T3,
      (t3: T3) => T4,
      (t4: T4) => T5,
      (t5: T5) => T6,
      (t6: T6) => T7,
      (t7: T7) => T8,
      (t8: T8) => T9,
      (t9: T9) => T10,
      (t10: T10) => T11,
      (t11: T11) => T12,
      (t12: T12) => T13,
      (t13: T13) => T14,
      (t14: T14) => T15,
      (t15: T15) => T16,
      (t16: T16) => T17,
      (t17: T17) => T18,
      (t18: T18) => T19,
      (t19: T19) => T20,
      (t20: T20) => T21,
      (t21: T21) => T22,
      (t22: T22) => T23,
      (t23: T23) => T24,
    ]
  ): T24;
  <
    T0,
    T1,
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
    T8,
    T9,
    T10,
    T11,
    T12,
    T13,
    T14,
    T15,
    T16,
    T17,
    T18,
    T19,
    T20,
    T21,
    T22,
    T23,
    T24,
    T25,
  >(
    initial: T0,
    ...fns: [
      (t0: T0) => T1,
      (t1: T1) => T2,
      (t2: T2) => T3,
      (t3: T3) => T4,
      (t4: T4) => T5,
      (t5: T5) => T6,
      (t6: T6) => T7,
      (t7: T7) => T8,
      (t8: T8) => T9,
      (t9: T9) => T10,
      (t10: T10) => T11,
      (t11: T11) => T12,
      (t12: T12) => T13,
      (t13: T13) => T14,
      (t14: T14) => T15,
      (t15: T15) => T16,
      (t16: T16) => T17,
      (t17: T17) => T18,
      (t18: T18) => T19,
      (t19: T19) => T20,
      (t20: T20) => T21,
      (t21: T21) => T22,
      (t22: T22) => T23,
      (t23: T23) => T24,
      (t24: T24) => T25,
    ]
  ): T25;
  <
    T0,
    T1,
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
    T8,
    T9,
    T10,
    T11,
    T12,
    T13,
    T14,
    T15,
    T16,
    T17,
    T18,
    T19,
    T20,
    T21,
    T22,
    T23,
    T24,
    T25,
    T26,
  >(
    initial: T0,
    ...fns: [
      (t0: T0) => T1,
      (t1: T1) => T2,
      (t2: T2) => T3,
      (t3: T3) => T4,
      (t4: T4) => T5,
      (t5: T5) => T6,
      (t6: T6) => T7,
      (t7: T7) => T8,
      (t8: T8) => T9,
      (t9: T9) => T10,
      (t10: T10) => T11,
      (t11: T11) => T12,
      (t12: T12) => T13,
      (t13: T13) => T14,
      (t14: T14) => T15,
      (t15: T15) => T16,
      (t16: T16) => T17,
      (t17: T17) => T18,
      (t18: T18) => T19,
      (t19: T19) => T20,
      (t20: T20) => T21,
      (t21: T21) => T22,
      (t22: T22) => T23,
      (t23: T23) => T24,
      (t24: T24) => T25,
      (t25: T25) => T26,
    ]
  ): T26;
  <
    T0,
    T1,
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
    T8,
    T9,
    T10,
    T11,
    T12,
    T13,
    T14,
    T15,
    T16,
    T17,
    T18,
    T19,
    T20,
    T21,
    T22,
    T23,
    T24,
    T25,
    T26,
    T27,
  >(
    initial: T0,
    ...fns: [
      (t0: T0) => T1,
      (t1: T1) => T2,
      (t2: T2) => T3,
      (t3: T3) => T4,
      (t4: T4) => T5,
      (t5: T5) => T6,
      (t6: T6) => T7,
      (t7: T7) => T8,
      (t8: T8) => T9,
      (t9: T9) => T10,
      (t10: T10) => T11,
      (t11: T11) => T12,
      (t12: T12) => T13,
      (t13: T13) => T14,
      (t14: T14) => T15,
      (t15: T15) => T16,
      (t16: T16) => T17,
      (t17: T17) => T18,
      (t18: T18) => T19,
      (t19: T19) => T20,
      (t20: T20) => T21,
      (t21: T21) => T22,
      (t22: T22) => T23,
      (t23: T23) => T24,
      (t24: T24) => T25,
      (t25: T25) => T26,
      (t26: T26) => T27,
    ]
  ): T27;
  <
    T0,
    T1,
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
    T8,
    T9,
    T10,
    T11,
    T12,
    T13,
    T14,
    T15,
    T16,
    T17,
    T18,
    T19,
    T20,
    T21,
    T22,
    T23,
    T24,
    T25,
    T26,
    T27,
    T28,
  >(
    initial: T0,
    ...fns: [
      (t0: T0) => T1,
      (t1: T1) => T2,
      (t2: T2) => T3,
      (t3: T3) => T4,
      (t4: T4) => T5,
      (t5: T5) => T6,
      (t6: T6) => T7,
      (t7: T7) => T8,
      (t8: T8) => T9,
      (t9: T9) => T10,
      (t10: T10) => T11,
      (t11: T11) => T12,
      (t12: T12) => T13,
      (t13: T13) => T14,
      (t14: T14) => T15,
      (t15: T15) => T16,
      (t16: T16) => T17,
      (t17: T17) => T18,
      (t18: T18) => T19,
      (t19: T19) => T20,
      (t20: T20) => T21,
      (t21: T21) => T22,
      (t22: T22) => T23,
      (t23: T23) => T24,
      (t24: T24) => T25,
      (t25: T25) => T26,
      (t26: T26) => T27,
      (t27: T27) => T28,
    ]
  ): T28;
  <
    T0,
    T1,
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
    T8,
    T9,
    T10,
    T11,
    T12,
    T13,
    T14,
    T15,
    T16,
    T17,
    T18,
    T19,
    T20,
    T21,
    T22,
    T23,
    T24,
    T25,
    T26,
    T27,
    T28,
    T29,
  >(
    initial: T0,
    ...fns: [
      (t0: T0) => T1,
      (t1: T1) => T2,
      (t2: T2) => T3,
      (t3: T3) => T4,
      (t4: T4) => T5,
      (t5: T5) => T6,
      (t6: T6) => T7,
      (t7: T7) => T8,
      (t8: T8) => T9,
      (t9: T9) => T10,
      (t10: T10) => T11,
      (t11: T11) => T12,
      (t12: T12) => T13,
      (t13: T13) => T14,
      (t14: T14) => T15,
      (t15: T15) => T16,
      (t16: T16) => T17,
      (t17: T17) => T18,
      (t18: T18) => T19,
      (t19: T19) => T20,
      (t20: T20) => T21,
      (t21: T21) => T22,
      (t22: T22) => T23,
      (t23: T23) => T24,
      (t24: T24) => T25,
      (t25: T25) => T26,
      (t26: T26) => T27,
      (t27: T27) => T28,
      (t28: T28) => T29,
    ]
  ): T29;
  <
    T0,
    T1,
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
    T8,
    T9,
    T10,
    T11,
    T12,
    T13,
    T14,
    T15,
    T16,
    T17,
    T18,
    T19,
    T20,
    T21,
    T22,
    T23,
    T24,
    T25,
    T26,
    T27,
    T28,
    T29,
    T30,
  >(
    initial: T0,
    ...fns: [
      (t0: T0) => T1,
      (t1: T1) => T2,
      (t2: T2) => T3,
      (t3: T3) => T4,
      (t4: T4) => T5,
      (t5: T5) => T6,
      (t6: T6) => T7,
      (t7: T7) => T8,
      (t8: T8) => T9,
      (t9: T9) => T10,
      (t10: T10) => T11,
      (t11: T11) => T12,
      (t12: T12) => T13,
      (t13: T13) => T14,
      (t14: T14) => T15,
      (t15: T15) => T16,
      (t16: T16) => T17,
      (t17: T17) => T18,
      (t18: T18) => T19,
      (t19: T19) => T20,
      (t20: T20) => T21,
      (t21: T21) => T22,
      (t22: T22) => T23,
      (t23: T23) => T24,
      (t24: T24) => T25,
      (t25: T25) => T26,
      (t26: T26) => T27,
      (t27: T27) => T28,
      (t28: T28) => T29,
      (t29: T29) => T30,
    ]
  ): T30;
};

export const pipeline: Pipeline = (initial: any, ...fns: Function[]) =>
  fns.reduce((value, fn) => fn(value), initial);
