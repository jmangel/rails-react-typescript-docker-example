export enum Step {
  n = 'new',
  k = 'choose key',
  e = 'edit',
  s = 'show',
};

const Steps = [
  Step.n,
  Step.k,
  Step.e,
  Step.s,
];

export const chooseKeyStepIndex = Steps.findIndex(step => step === Step.k);

export default Steps;