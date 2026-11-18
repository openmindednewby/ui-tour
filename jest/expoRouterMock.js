const push = jest.fn();
module.exports = { useRouter: () => ({ push }), routerPush: push };
