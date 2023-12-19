export default function newInterceptTop(params) {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    window.upgradeDialogNew.create(params, function(res) {
      if (res) {
        resolve();
      } else {
        reject();
      }
    });
  });
}
