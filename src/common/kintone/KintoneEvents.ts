export const KintoneEvents = {
  /**
   * レコード一覧画面
   */
  Index: {
    Show: ["app.record.index.show", "mobile.app.record.index.show"],

    Delete: ["app.record.index.delete.submit"],

    Edit: {
      Show: ["app.record.index.edit.show"],

      Submit: ["app.record.index.edit.submit"],

      SubmitSuccess: ["app.record.index.edit.submit.success"],
    },
  },

  /**
   * レコード詳細画面
   */
  Detail: {
    Show: ["app.record.detail.show", "mobile.app.record.detail.show"],

    Delete: [
      "app.record.detail.delete.submit",
      "mobile.app.record.detail.delete.submit",
    ],

    Proceed: [
      "app.record.detail.process.proceed",
      "mobile.app.record.detail.process.proceed",
    ],
  },

  /**
   * レコード追加画面
   */
  Create: {
    Show: ["app.record.create.show", "mobile.app.record.create.show"],

    Submit: ["app.record.create.submit", "mobile.app.record.create.submit"],

    SubmitSuccess: [
      "app.record.create.submit.success",
      "mobile.app.record.create.submit.success",
    ],
  },

  /**
   * レコード編集画面
   */
  Edit: {
    Show: ["app.record.edit.show", "mobile.app.record.edit.show"],

    Submit: ["app.record.edit.submit", "mobile.app.record.edit.submit"],

    SubmitSuccess: [
      "app.record.edit.submit.success",
      "mobile.app.record.edit.submit.success",
    ],
  },
};
