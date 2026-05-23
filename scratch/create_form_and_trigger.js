/**
 * 春日部大西毎日腎クリニック 採用応募フォーム自動生成スクリプト
 * 
 * 【使い方】
 * 1. Google ドライブ (https://drive.google.com/) にアクセスします。
 * 2. 左上の「新規」 > 「その他」 > 「Google Apps Script」をクリックします。
 * 3. エディタが開いたら、このファイルの内容をすべてコピー＆ペーストします。
 * 4. ファイルを保存（Ctrl + S）し、関数 `createRecruitForm` を選択して「実行」ボタンを押します。
 * 5. 初回実行時は承認を求められますので、画面の指示に従ってアクセス許可を付与してください。
 * 6. 実行後、ログ（実行ログ）にフォームの編集URLと公開URL、および各質問項目の「エントリーID」が表示されます。
 *    ※エントリーID（例: entry.123456789）は求人サイトの JavaScript (app.js) の設定に反映させてください。
 * 7. 続いて、関数 `setupTrigger` を選択して「実行」ボタンを押すと、応募送信時にメールが自動送信されるようになります。
 */

// ★応募があった際に通知を受け取る採用担当者様のメールアドレス
// 必要に応じて書き換えてください。
var NOTIFICATION_EMAIL_RECIPIENT = 'recruit2026@mainichi.clinic,ohnishi.md@mainichi.clinic,ohnishi.rt@mainichi.clinic';

/**
 * 1. 求人応募フォームを作成するメイン関数
 */
function createRecruitForm() {
  // フォームの新規作成
  var form = FormApp.create('春日部大西毎日腎クリニック 採用応募フォーム');
  form.setDescription('春日部大西毎日腎クリニックの採用応募フォームです。必要事項を入力の上、送信してください。\n※すべての職種において、当クリニックの理念に合う方を条件としています。');
  
  // 1. 希望職種 (ラジオボタン - 必須)
  var itemJob = form.addMultipleChoiceItem();
  itemJob.setTitle('希望職種')
         .setChoices([
           itemJob.createChoice('医療事務・受付'),
           itemJob.createChoice('送迎ドライバー'),
           itemJob.createChoice('医師（非常勤）')
         ])
         .setRequired(true);

  // 1.5. 希望の雇用形態 (ラジオボタン - 必須)
  var itemEmployment = form.addMultipleChoiceItem();
  itemEmployment.setTitle('希望の雇用形態')
                .setChoices([
                  itemEmployment.createChoice('常勤'),
                  itemEmployment.createChoice('非常勤（パート）')
                ])
                .setRequired(true);

  // 1.6. 希望の勤務日数・曜日 (段落テキスト - 任意)
  var itemWorkSchedule = form.addParagraphTextItem();
  itemWorkSchedule.setTitle('希望の勤務日数・曜日・時間帯')
                  .setHelpText('例: 週3日程度、土曜日勤務可能、午前のみ希望など')
                  .setRequired(false);
  
  // 2. お名前 (記述式 - 必須)
  form.addTextItem().setTitle('お名前').setRequired(true);
  
  // 3. フリガナ (記述式 - 必須)
  form.addTextItem().setTitle('フリガナ').setRequired(true);
  
  // 4. 生年月日 (日付 - 必須)
  form.addDateItem().setTitle('生年月日').setRequired(true);

  // 5. 性別 (ラジオボタン - 任意)
  var itemGender = form.addMultipleChoiceItem();
  itemGender.setTitle('性別')
            .setChoices([
              itemGender.createChoice('男性'),
              itemGender.createChoice('女性'),
              itemGender.createChoice('回答しない')
            ])
            .setRequired(false);
  
  // 6. 電話番号 (記述式 - 必須)
  var phoneItem = form.addTextItem();
  phoneItem.setTitle('電話番号').setRequired(true);
  var phoneValidation = FormApp.createTextValidation()
    .requireTextMatchesPattern('^[0-9\\-]+$')
    .setHelpText('半角数字とハイフンのみで入力してください。')
    .build();
  phoneItem.setValidation(phoneValidation);
  
  // 7. メールアドレス (記述式 - 必須)
  var emailItem = form.addTextItem();
  emailItem.setTitle('メールアドレス').setRequired(true);
  var emailValidation = FormApp.createTextValidation()
    .requireTextIsEmail()
    .setHelpText('有効なメールアドレスを入力してください。')
    .build();
  emailItem.setValidation(emailValidation);
  
  // 8. ご住所 (段落テキスト - 任意)
  form.addParagraphTextItem().setTitle('ご住所（郵便番号・市区町村・番地など）').setRequired(false);
  
  // 9. 保有資格 (段落テキスト - 任意)
  form.addParagraphTextItem().setTitle('保有資格（医師免許、運転免許、医療事務資格など）\n※お持ちの資格があればご記入ください。').setRequired(false);
  
  // 10. 自己PR・志望動機・質問など (段落テキスト - 任意)
  form.addParagraphTextItem().setTitle('自己PR・志望動機・その他ご連絡事項').setRequired(false);

  // フォーム設定
  form.setCollectEmail(false); // メールアドレスはフォーム項目で明示的に集めるため自動収集はOFF
  form.setAllowResponseEdits(false);
  form.setLimitOneResponsePerUser(false);
  
  Logger.log('==================================================');
  Logger.log('🎉 フォームが正常に作成されました！');
  Logger.log('--------------------------------------------------');
  Logger.log('【編集用URL】（回答の確認や編集ができます）:');
  Logger.log(form.getEditUrl());
  Logger.log('--------------------------------------------------');
  Logger.log('【公開用URL】（求人サイトからのリンク先になります）:');
  Logger.log(form.getPublishedUrl());
  Logger.log('==================================================');
  
  // 質問項目ごとの entry.xxxx IDを取得するための出力
  Logger.log('⚠️ 【重要】求人サイト(app.js)連携用エントリーID一覧:');
  var items = form.getItems();
  for (var i = 0; i < items.length; i++) {
    Logger.log('質問名: 「' + items[i].getTitle().split('\n')[0] + '」 | 項目ID: ' + items[i].getId());
  }
  Logger.log('※フォームのHTMLソース、あるいはブラウザの開発者ツールで "entry.<項目ID>" の形式でパラメータを指定することでプレフィルが可能です。');
  Logger.log('==================================================');
  
  // スクリプトのプロパティに作成したフォームのIDを保存（トリガー設定用）
  var properties = PropertiesService.getScriptProperties();
  properties.setProperty('CREATED_FORM_ID', form.getId());
}

/**
 * 2. フォーム送信時にメールを送るためのトリガーを設定する関数
 */
function setupTrigger() {
  var properties = PropertiesService.getScriptProperties();
  var formId = properties.getProperty('CREATED_FORM_ID');
  
  var form;
  if (formId) {
    form = FormApp.openById(formId);
  } else {
    // 取得できない場合はアクティブフォームを試みる
    try {
      form = FormApp.getActiveForm();
    } catch(e) {
      Logger.log('フォームが開けませんでした。先に createRecruitForm を実行してください。');
      return;
    }
  }
  
  if (!form) {
    Logger.log('対象のフォームが見つかりません。先に createRecruitForm を実行してください。');
    return;
  }
  
  // 既存のトリガーを削除して重複を防ぐ
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'onFormSubmit') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  
  // 新規トリガーの作成
  ScriptApp.newTrigger('onFormSubmit')
           .forForm(form)
           .onFormSubmit()
           .create();
  
  Logger.log('==================================================');
  Logger.log('🎉 応募通知メールの自動送信トリガーを登録しました！');
  Logger.log('送信先アドレス: ' + NOTIFICATION_EMAIL_RECIPIENT);
  Logger.log('==================================================');
}

/**
 * 3. フォーム送信時に実行されるイベントハンドラ
 */
function onFormSubmit(e) {
  var response = e.response;
  var itemResponses = response.getItemResponses();
  
  var subject = '【求人応募】ホームページから新しい応募がありました';
  
  var body = '春日部大西毎日腎クリニック 求人サイトより新しい応募がありました。\n';
  body += '内容を確認し、応募者へ選考のご連絡をお願いいたします。\n\n';
  body += '--------------------------------------------------\n';
  body += '■ 応募日時: ' + response.getTimestamp() + '\n';
  body += '--------------------------------------------------\n\n';
  
  var applicantEmail = '';
  var applicantName = '';
  
  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    var title = itemResponse.getItem().getTitle().split('\n')[0]; // 改行以降の説明文を除去
    var value = itemResponse.getResponse();
    
    body += '■ ' + title + ':\n' + value + '\n\n';
    
    // メールアドレスと名前を抽出して返信用に保持
    if (title.indexOf('メールアドレス') !== -1) {
      applicantEmail = value;
    } else if (title.indexOf('お名前') !== -1) {
      applicantName = value;
    }
  }
  
  body += '--------------------------------------------------\n';
  body += '※このメールはGoogle Apps Scriptによる自動送信です。\n';
  body += '応募者の詳細、および過去の応募一覧はGoogleスプレッドシート等でご確認ください。\n';
  
  // 返信先（Reply-to）に応募者のアドレスを設定してメール送信
  var mailOptions = {
    replyTo: applicantEmail || undefined,
    body: body
  };
  
  try {
    MailApp.sendEmail(NOTIFICATION_EMAIL_RECIPIENT, subject, body, mailOptions);
    Logger.log('応募通知メールを送信しました。宛先: ' + NOTIFICATION_EMAIL_RECIPIENT);
  } catch (error) {
    Logger.log('メール送信エラー: ' + error.toString());
  }
}

/**
 * 作成済みフォームのURLや連携用エントリーID（entry.xxxx）をログに再出力する関数
 * 
 * ※実行ログを消してしまった場合は、GASエディタ上部の関数選択メニューから
 *   `showFormDetails` を選択して「実行」ボタンを押してください。
 */
function showFormDetails() {
  var properties = PropertiesService.getScriptProperties();
  var formId = properties.getProperty('CREATED_FORM_ID');
  
  if (!formId) {
    Logger.log('作成済みのフォームIDが見つかりません。先に createRecruitForm を実行してください。');
    return;
  }
  
  try {
    var form = FormApp.openById(formId);
    Logger.log('==================================================');
    Logger.log('ℹ️ 作成済みフォームの情報を再出力します。');
    Logger.log('--------------------------------------------------');
    Logger.log('【編集用URL】:');
    Logger.log(form.getEditUrl());
    Logger.log('--------------------------------------------------');
    Logger.log('【公開用URL】:');
    Logger.log(form.getPublishedUrl());
    Logger.log('==================================================');
    
    Logger.log('⚠️ 【重要】求人サイト(app.js)連携用エントリーID一覧:');
    var items = form.getItems();
    for (var i = 0; i < items.length; i++) {
      Logger.log('質問名: 「' + items[i].getTitle().split('\n')[0] + '」 | 項目ID: ' + items[i].getId());
    }
    Logger.log('※ "entry.<項目ID>" の形式でパラメータを指定してプレフィルが可能です。');
    Logger.log('==================================================');
  } catch(e) {
    Logger.log('フォームを開けませんでした。IDが変更されたか削除された可能性があります: ' + e.toString());
  }
}
