import type { Schema, Struct } from '@strapi/strapi';

export interface AdminApiToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    encryptedKey: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'read-only'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminPermission extends Struct.CollectionTypeSchema {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    conditions: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<[]>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::permission'> &
      Schema.Attribute.Private;
    properties: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<'manyToOne', 'admin::role'>;
    subject: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminRole extends Struct.CollectionTypeSchema {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::role'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<'oneToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<'manyToMany', 'admin::user'>;
  };
}

export interface AdminTransferToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferTokenPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::transfer-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminUser extends Struct.CollectionTypeSchema {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    blocked: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    lastname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::user'> &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registrationToken: Schema.Attribute.String & Schema.Attribute.Private;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    roles: Schema.Attribute.Relation<'manyToMany', 'admin::role'> &
      Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String;
  };
}

export interface ApiAffiliateDashboardAffiliateDashboard
  extends Struct.CollectionTypeSchema {
  collectionName: 'affiliate_dashboards';
  info: {
    displayName: 'Affiliate Dashboard';
    pluralName: 'affiliate-dashboards';
    singularName: 'affiliate-dashboard';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    confirm_affiliate_payment: Schema.Attribute.Boolean;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::affiliate-dashboard.affiliate-dashboard'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiAffiliateTreeAffiliateTree
  extends Struct.CollectionTypeSchema {
  collectionName: 'affiliate_trees';
  info: {
    displayName: 'Affiliate Tree';
    pluralName: 'affiliate-trees';
    singularName: 'affiliate-tree';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    childUser: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    level: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 10;
          min: 1;
        },
        number
      >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::affiliate-tree.affiliate-tree'
    > &
      Schema.Attribute.Private;
    parentUser: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiBlogCategoryBlogCategory
  extends Struct.CollectionTypeSchema {
  collectionName: 'blog_categories';
  info: {
    displayName: 'Blog Category';
    pluralName: 'blog-categories';
    singularName: 'blog-category';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    blogs: Schema.Attribute.Relation<'oneToMany', 'api::blog.blog'>;
    categoryImage: Schema.Attribute.Media<'images' | 'files'>;
    categoryName: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::blog-category.blog-category'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiBlogBlog extends Struct.CollectionTypeSchema {
  collectionName: 'blogs';
  info: {
    displayName: 'Blog';
    pluralName: 'blogs';
    singularName: 'blog';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    blog_category: Schema.Attribute.Relation<
      'manyToOne',
      'api::blog-category.blog-category'
    >;
    blog_description: Schema.Attribute.Blocks & Schema.Attribute.Required;
    blog_image: Schema.Attribute.Media<'images' | 'files', true> &
      Schema.Attribute.Required;
    blog_title: Schema.Attribute.Text & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::blog.blog'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiBonusRuleBonusRule extends Struct.CollectionTypeSchema {
  collectionName: 'bonus_rules';
  info: {
    displayName: 'Level Income Rule';
    pluralName: 'bonus-rules';
    singularName: 'bonus-rule';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    directRequired: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::bonus-rule.bonus-rule'
    > &
      Schema.Attribute.Private;
    maxLevel: Schema.Attribute.Integer;
    name: Schema.Attribute.Enumeration<['DIRECT_3', 'DIRECT_5']>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user_bonus_status: Schema.Attribute.Relation<
      'oneToMany',
      'api::user-bonus-status.user-bonus-status'
    >;
    validDays: Schema.Attribute.Integer & Schema.Attribute.Required;
  };
}

export interface ApiClub250MembersClub250Member
  extends Struct.CollectionTypeSchema {
  collectionName: 'club_250_members';
  info: {
    displayName: 'Club 250 Members';
    pluralName: 'club-250-members';
    singularName: 'club-250-member';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    accountname: Schema.Attribute.String;
    accountno: Schema.Attribute.String;
    accounttype: Schema.Attribute.String;
    acid: Schema.Attribute.Integer;
    adjustment: Schema.Attribute.Decimal;
    ballanceamt: Schema.Attribute.Decimal;
    bankname: Schema.Attribute.String;
    banktransid: Schema.Attribute.String;
    bid: Schema.Attribute.Integer;
    branchcode: Schema.Attribute.String;
    branchname: Schema.Attribute.String;
    brequestno: Schema.Attribute.String;
    clientid: Schema.Attribute.String;
    couponno: Schema.Attribute.String;
    crdb: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    credit: Schema.Attribute.Decimal;
    debit: Schema.Attribute.Decimal;
    empirecallsid: Schema.Attribute.String;
    errormessage: Schema.Attribute.Text;
    handlingcharge: Schema.Attribute.Decimal;
    handlingrate: Schema.Attribute.Decimal;
    ifsccode: Schema.Attribute.String;
    impsrefno: Schema.Attribute.String;
    ip: Schema.Attribute.String;
    levelincomerp: Schema.Attribute.Decimal;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::club-250-members.club-250-member'
    > &
      Schema.Attribute.Private;
    lockfordisplay: Schema.Attribute.Boolean;
    lockforpayment: Schema.Attribute.Boolean;
    logstatus: Schema.Attribute.String;
    minuspayble: Schema.Attribute.Decimal;
    mpoid: Schema.Attribute.Integer;
    netpayable: Schema.Attribute.Decimal;
    othercharge: Schema.Attribute.Decimal;
    paid: Schema.Attribute.Boolean;
    payid: Schema.Attribute.Integer;
    payidsindex: Schema.Attribute.Integer;
    paymentdate: Schema.Attribute.String;
    paymode: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    recipt: Schema.Attribute.String;
    referenceno: Schema.Attribute.String;
    refno: Schema.Attribute.String;
    regno: Schema.Attribute.String;
    remark: Schema.Attribute.Text;
    reqstatus: Schema.Attribute.String;
    requestno: Schema.Attribute.String;
    rid: Schema.Attribute.Integer;
    rstatus: Schema.Attribute.String;
    seen: Schema.Attribute.Boolean;
    swiftcode: Schema.Attribute.String;
    tdsamount: Schema.Attribute.Decimal;
    tdsrate: Schema.Attribute.Decimal;
    tramount: Schema.Attribute.Decimal;
    transactionid: Schema.Attribute.String;
    transdate: Schema.Attribute.String;
    transferid: Schema.Attribute.String;
    transferstatus: Schema.Attribute.String;
    transno: Schema.Attribute.String;
    transtype: Schema.Attribute.String;
    trappby: Schema.Attribute.String;
    trappdate: Schema.Attribute.String;
    trcode: Schema.Attribute.String;
    trct: Schema.Attribute.String;
    trdate: Schema.Attribute.String;
    trkid: Schema.Attribute.Integer;
    trmobile: Schema.Attribute.String;
    trqty: Schema.Attribute.Integer;
    trrtype: Schema.Attribute.String;
    trsp: Schema.Attribute.String;
    trstatus: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiClub50MembersClub50Member
  extends Struct.CollectionTypeSchema {
  collectionName: 'club_50_members';
  info: {
    displayName: 'Club 50 Members';
    pluralName: 'club-50-members';
    singularName: 'club-50-member';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    accountname: Schema.Attribute.String;
    accountno: Schema.Attribute.String;
    accounttype: Schema.Attribute.String;
    acid: Schema.Attribute.String;
    adjustment: Schema.Attribute.Decimal;
    ballanceamt: Schema.Attribute.Decimal;
    bankname: Schema.Attribute.String;
    banktransid: Schema.Attribute.String;
    bid: Schema.Attribute.String;
    branchcode: Schema.Attribute.String;
    branchname: Schema.Attribute.String;
    brequestno: Schema.Attribute.String;
    clientid: Schema.Attribute.String;
    couponno: Schema.Attribute.String;
    crdb: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    credit: Schema.Attribute.Decimal;
    debit: Schema.Attribute.Decimal;
    empirecallsid: Schema.Attribute.String;
    errormessage: Schema.Attribute.Text;
    handlingcharge: Schema.Attribute.Decimal;
    handlingrate: Schema.Attribute.Decimal;
    ifsccode: Schema.Attribute.String;
    impsrefno: Schema.Attribute.String;
    ip: Schema.Attribute.String;
    levelincomerp: Schema.Attribute.Decimal;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::club-50-members.club-50-member'
    > &
      Schema.Attribute.Private;
    lockfordisplay: Schema.Attribute.Boolean;
    lockforpayment: Schema.Attribute.Boolean;
    logstatus: Schema.Attribute.String;
    minuspayble: Schema.Attribute.Decimal;
    mpoid: Schema.Attribute.String;
    netpayable: Schema.Attribute.Decimal;
    othercharge: Schema.Attribute.Decimal;
    paid: Schema.Attribute.Boolean;
    payid: Schema.Attribute.String;
    payidsindex: Schema.Attribute.String;
    paymentdate: Schema.Attribute.DateTime;
    paymode: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    recipt: Schema.Attribute.String;
    referenceno: Schema.Attribute.String;
    refno: Schema.Attribute.String;
    regno: Schema.Attribute.String;
    remark: Schema.Attribute.Text;
    reqstatus: Schema.Attribute.String;
    requestno: Schema.Attribute.String;
    rid: Schema.Attribute.String;
    rstatus: Schema.Attribute.String;
    seen: Schema.Attribute.Boolean;
    swiftcode: Schema.Attribute.String;
    tdsamount: Schema.Attribute.Decimal;
    tdsrate: Schema.Attribute.Decimal;
    tramount: Schema.Attribute.Decimal;
    transactionid: Schema.Attribute.String;
    transdate: Schema.Attribute.DateTime;
    transferid: Schema.Attribute.String;
    transferstatus: Schema.Attribute.String;
    transno: Schema.Attribute.String;
    transtype: Schema.Attribute.String;
    trappby: Schema.Attribute.String;
    trappdate: Schema.Attribute.DateTime;
    trcode: Schema.Attribute.String;
    trct: Schema.Attribute.String;
    trdate: Schema.Attribute.DateTime;
    trkid: Schema.Attribute.String;
    trmobile: Schema.Attribute.String;
    trqty: Schema.Attribute.Integer;
    trrtype: Schema.Attribute.String;
    trsp: Schema.Attribute.String;
    trstatus: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiClub500MembersClub500Member
  extends Struct.CollectionTypeSchema {
  collectionName: 'club_500_members';
  info: {
    displayName: 'Club 500 Members';
    pluralName: 'club-500-members';
    singularName: 'club-500-member';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    accountname: Schema.Attribute.String;
    accountno: Schema.Attribute.String;
    accounttype: Schema.Attribute.String;
    acid: Schema.Attribute.Integer;
    adjustment: Schema.Attribute.Decimal;
    ballanceamt: Schema.Attribute.Decimal;
    bankname: Schema.Attribute.String;
    banktransid: Schema.Attribute.String;
    bid: Schema.Attribute.Integer;
    branchcode: Schema.Attribute.String;
    branchname: Schema.Attribute.String;
    brequestno: Schema.Attribute.String;
    clientid: Schema.Attribute.String;
    couponno: Schema.Attribute.String;
    crdb: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    credit: Schema.Attribute.Decimal;
    debit: Schema.Attribute.Decimal;
    empirecallsid: Schema.Attribute.String;
    errormessage: Schema.Attribute.Text;
    handlingcharge: Schema.Attribute.Decimal;
    handlingrate: Schema.Attribute.Decimal;
    ifsccode: Schema.Attribute.String;
    impsrefno: Schema.Attribute.String;
    ip: Schema.Attribute.String;
    levelincomerp: Schema.Attribute.Decimal;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::club-500-members.club-500-member'
    > &
      Schema.Attribute.Private;
    lockfordisplay: Schema.Attribute.Boolean;
    lockforpayment: Schema.Attribute.Boolean;
    logstatus: Schema.Attribute.String;
    minuspayble: Schema.Attribute.Decimal;
    mpoid: Schema.Attribute.Integer;
    netpayable: Schema.Attribute.Decimal;
    othercharge: Schema.Attribute.Decimal;
    paid: Schema.Attribute.Boolean;
    payid: Schema.Attribute.Integer;
    payidsindex: Schema.Attribute.Integer;
    paymentdate: Schema.Attribute.String;
    paymode: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    recipt: Schema.Attribute.String;
    referenceno: Schema.Attribute.String;
    refno: Schema.Attribute.String;
    regno: Schema.Attribute.String;
    remark: Schema.Attribute.Text;
    reqstatus: Schema.Attribute.String;
    requestno: Schema.Attribute.String;
    rid: Schema.Attribute.Integer;
    rstatus: Schema.Attribute.String;
    seen: Schema.Attribute.Boolean;
    swiftcode: Schema.Attribute.String;
    tdsamount: Schema.Attribute.Decimal;
    tdsrate: Schema.Attribute.Decimal;
    tramount: Schema.Attribute.Decimal;
    transactionid: Schema.Attribute.String;
    transdate: Schema.Attribute.String;
    transferid: Schema.Attribute.String;
    transferstatus: Schema.Attribute.String;
    transno: Schema.Attribute.String;
    transtype: Schema.Attribute.String;
    trappby: Schema.Attribute.String;
    trappdate: Schema.Attribute.String;
    trcode: Schema.Attribute.String;
    trct: Schema.Attribute.String;
    trdate: Schema.Attribute.String;
    trkid: Schema.Attribute.Integer;
    trmobile: Schema.Attribute.String;
    trqty: Schema.Attribute.Integer;
    trrtype: Schema.Attribute.String;
    trsp: Schema.Attribute.String;
    trstatus: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiClubClub extends Struct.CollectionTypeSchema {
  collectionName: 'clubs';
  info: {
    displayName: 'Club Income Rule';
    pluralName: 'clubs';
    singularName: 'club';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    amountPerAdmission: Schema.Attribute.Decimal;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    durationMonths: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::club.club'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.Enumeration<['CLUB_50', 'CLUB_250', 'CLUB_500']>;
    publishedAt: Schema.Attribute.DateTime;
    requiredReferrals: Schema.Attribute.Integer;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user_club_status: Schema.Attribute.Relation<
      'oneToMany',
      'api::user-club-status.user-club-status'
    >;
  };
}

export interface ApiCommissionLevelCommissionLevel
  extends Struct.CollectionTypeSchema {
  collectionName: 'commission_levels';
  info: {
    displayName: 'Commission Level';
    pluralName: 'commission-levels';
    singularName: 'commission-level';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    level: Schema.Attribute.Component<'all-levels.all-levels-component', false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::commission-level.commission-level'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCommissionCommission extends Struct.CollectionTypeSchema {
  collectionName: 'commissions';
  info: {
    displayName: 'Commission';
    pluralName: 'commissions';
    singularName: 'commission';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    admin_comment: Schema.Attribute.String;
    amount: Schema.Attribute.Decimal;
    club: Schema.Attribute.Enumeration<['CLUB_50', 'CLUB_250', 'CLUB_500']>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    credit: Schema.Attribute.Decimal;
    debit: Schema.Attribute.Decimal;
    earnedAt: Schema.Attribute.DateTime;
    earner: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    estimated_credit_at: Schema.Attribute.DateTime;
    level: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::commission.commission'
    > &
      Schema.Attribute.Private;
    paidAt: Schema.Attribute.DateTime;
    payment: Schema.Attribute.Relation<'manyToOne', 'api::payment.payment'>;
    publishedAt: Schema.Attribute.DateTime;
    regno: Schema.Attribute.String;
    remark: Schema.Attribute.String;
    sourceUser: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    tramount: Schema.Attribute.Decimal;
    transaction_for: Schema.Attribute.Enumeration<
      ['LEVEL_INCOME', 'CLUB_INCOME', 'WITHDRAW', 'DEDUCT']
    >;
    transaction_history: Schema.Attribute.Relation<
      'oneToOne',
      'api::transaction-history.transaction-history'
    >;
    transaction_status: Schema.Attribute.Enumeration<
      ['SUCCESS', 'FAILED', 'PENDING', 'REJECTED', 'CANCELLED']
    >;
    transaction_type: Schema.Attribute.Enumeration<['CREDIT', 'DEBIT']>;
    transactionId: Schema.Attribute.BigInteger;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wallet: Schema.Attribute.Relation<'manyToOne', 'api::wallet.wallet'>;
  };
}

export interface ApiContactEnquiryContactEnquiry
  extends Struct.CollectionTypeSchema {
  collectionName: 'contact_enquiries';
  info: {
    displayName: 'Contact Enquiry';
    pluralName: 'contact-enquiries';
    singularName: 'contact-enquiry';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    course_type: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::contact-enquiry.contact-enquiry'
    > &
      Schema.Attribute.Private;
    message: Schema.Attribute.Text;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCourseCategoryCourseCategory
  extends Struct.CollectionTypeSchema {
  collectionName: 'course_categories';
  info: {
    displayName: 'Course Category';
    pluralName: 'course-categories';
    singularName: 'course-category';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    category_name: Schema.Attribute.String;
    course_modules: Schema.Attribute.Relation<
      'oneToMany',
      'api::course-module.course-module'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::course-category.course-category'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    quiz: Schema.Attribute.Relation<'manyToOne', 'api::quiz.quiz'>;
    recorderd_lectures: Schema.Attribute.Relation<
      'oneToMany',
      'api::recorderd-lecture.recorderd-lecture'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    webinars: Schema.Attribute.Relation<'manyToMany', 'api::webinar.webinar'>;
  };
}

export interface ApiCourseModuleCourseModule
  extends Struct.CollectionTypeSchema {
  collectionName: 'course_modules';
  info: {
    displayName: 'Course Module';
    pluralName: 'course-modules';
    singularName: 'course-module';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    course_category: Schema.Attribute.Relation<
      'manyToOne',
      'api::course-category.course-category'
    >;
    course_playlists: Schema.Attribute.Relation<
      'oneToMany',
      'api::course-playlist.course-playlist'
    >;
    course_progress: Schema.Attribute.Decimal;
    course_resources_desc: Schema.Attribute.Text;
    course_resources_download: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    course_resources_title: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::course-module.course-module'
    > &
      Schema.Attribute.Private;
    order: Schema.Attribute.Integer;
    playlist: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    quiz: Schema.Attribute.Relation<'oneToOne', 'api::quiz.quiz'>;
    quiz_score: Schema.Attribute.Relation<
      'oneToMany',
      'api::quiz-score.quiz-score'
    >;
    recorderd_lecture: Schema.Attribute.Relation<
      'manyToOne',
      'api::recorderd-lecture.recorderd-lecture'
    >;
    teacher: Schema.Attribute.Relation<'manyToOne', 'api::teacher.teacher'>;
    thumbnail: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    thumbnail_img_path: Schema.Attribute.String;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    video_progresses: Schema.Attribute.Relation<
      'oneToMany',
      'api::video-progress.video-progress'
    >;
  };
}

export interface ApiCoursePlaylistCoursePlaylist
  extends Struct.CollectionTypeSchema {
  collectionName: 'course_playlists';
  info: {
    displayName: 'Course Playlist';
    pluralName: 'course-playlists';
    singularName: 'course-playlist';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    course_module: Schema.Attribute.Relation<
      'manyToOne',
      'api::course-module.course-module'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    duration: Schema.Attribute.Integer;
    is_free_preview: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::course-playlist.course-playlist'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    vdo_id: Schema.Attribute.String;
  };
}

export interface ApiFaqFaq extends Struct.SingleTypeSchema {
  collectionName: 'faqs';
  info: {
    displayName: 'Faq';
    pluralName: 'faqs';
    singularName: 'faq';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    faqs: Schema.Attribute.Component<'all-faqs.faq-component', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::faq.faq'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiKycDocumentKycDocument extends Struct.CollectionTypeSchema {
  collectionName: 'kyc_documents';
  info: {
    displayName: 'Kyc Document';
    pluralName: 'kyc-documents';
    singularName: 'kyc-document';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    aadhar_card: Schema.Attribute.String;
    aadhar_doc: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    account_number: Schema.Attribute.String;
    address_proof_doc: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    address_proof_doc_path: Schema.Attribute.String;
    admin_remarks: Schema.Attribute.String;
    bank_name: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    id_proof_doc_path: Schema.Attribute.String;
    ifsc_code: Schema.Attribute.String;
    kyc_status: Schema.Attribute.Enumeration<
      ['PENDING', 'IN_PROGRESS', 'APPROVED', 'REJECTED']
    > &
      Schema.Attribute.DefaultTo<'PENDING'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::kyc-document.kyc-document'
    > &
      Schema.Attribute.Private;
    pan_card: Schema.Attribute.String;
    pan_doc: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    pan_doc_path: Schema.Attribute.String;
    passbook_doc: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    passbook_doc_path: Schema.Attribute.String;
    payouts: Schema.Attribute.Relation<'oneToMany', 'api::payout.payout'>;
    photo_doc_path: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    regno: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    upi_id: Schema.Attribute.String;
    user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiMemberAccountsMemberAccount
  extends Struct.CollectionTypeSchema {
  collectionName: 'member_accounts';
  info: {
    displayName: 'Member Account';
    pluralName: 'member-accounts';
    singularName: 'member-account';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    accountname: Schema.Attribute.String;
    accountno: Schema.Attribute.String;
    accounttype: Schema.Attribute.String;
    acid: Schema.Attribute.String;
    adjustment: Schema.Attribute.Decimal;
    bankname: Schema.Attribute.String;
    banktransid: Schema.Attribute.String;
    bid: Schema.Attribute.String;
    branchcode: Schema.Attribute.String;
    branchname: Schema.Attribute.String;
    brequestno: Schema.Attribute.String;
    clientid: Schema.Attribute.String;
    couponno: Schema.Attribute.String;
    crdb: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    credit: Schema.Attribute.Decimal;
    debit: Schema.Attribute.Decimal;
    earner: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    empirecallsid: Schema.Attribute.String;
    errormessage: Schema.Attribute.Text;
    handlingcharge: Schema.Attribute.Decimal;
    handlingrate: Schema.Attribute.Decimal;
    ifsccode: Schema.Attribute.String;
    impsrefno: Schema.Attribute.String;
    ip: Schema.Attribute.String;
    levelincomerp: Schema.Attribute.Decimal;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::member-accounts.member-account'
    > &
      Schema.Attribute.Private;
    lockfordisplay: Schema.Attribute.Boolean;
    lockforpayment: Schema.Attribute.Boolean;
    mpoid: Schema.Attribute.String;
    netpayable: Schema.Attribute.Decimal;
    othercharge: Schema.Attribute.Decimal;
    paid: Schema.Attribute.Boolean;
    payid: Schema.Attribute.String;
    payidsindex: Schema.Attribute.String;
    paymentdate: Schema.Attribute.DateTime;
    paymode: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    recipt: Schema.Attribute.String;
    referenceno: Schema.Attribute.String;
    refno: Schema.Attribute.String;
    regno: Schema.Attribute.String;
    remark: Schema.Attribute.Text;
    reqstatus: Schema.Attribute.String;
    requestno: Schema.Attribute.String;
    rid: Schema.Attribute.String;
    rstatus: Schema.Attribute.String;
    seen: Schema.Attribute.Boolean;
    swiftcode: Schema.Attribute.String;
    tdsamount: Schema.Attribute.Decimal;
    tdsrate: Schema.Attribute.Decimal;
    tramount: Schema.Attribute.Decimal;
    transactionid: Schema.Attribute.String;
    transdate: Schema.Attribute.DateTime;
    transferid: Schema.Attribute.String;
    transferstatus: Schema.Attribute.String;
    transno: Schema.Attribute.String;
    transtype: Schema.Attribute.String;
    trappby: Schema.Attribute.String;
    trappdate: Schema.Attribute.DateTime;
    trcode: Schema.Attribute.String;
    trct: Schema.Attribute.String;
    trdate: Schema.Attribute.DateTime;
    trkid: Schema.Attribute.String;
    trmobile: Schema.Attribute.String;
    trqty: Schema.Attribute.Integer;
    trrtype: Schema.Attribute.String;
    trsp: Schema.Attribute.String;
    trstatus: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMemberLevelBinariesMemberLevelBinary
  extends Struct.CollectionTypeSchema {
  collectionName: 'member_level_binaries';
  info: {
    displayName: 'Member Level Binary';
    pluralName: 'member-level-binaries';
    singularName: 'member-level-binary';
  };
  options: {
    comment: '';
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    Levels: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::member-level-binaries.member-level-binary'
    > &
      Schema.Attribute.Private;
    mlActive: Schema.Attribute.Boolean;
    MLID: Schema.Attribute.Integer;
    paid: Schema.Attribute.Boolean;
    paid1: Schema.Attribute.Boolean;
    paid2: Schema.Attribute.Boolean;
    payid: Schema.Attribute.Integer;
    publishedAt: Schema.Attribute.DateTime;
    RegNo: Schema.Attribute.String;
    rlCount: Schema.Attribute.Integer;
    rlIncome: Schema.Attribute.Decimal;
    tlCount: Schema.Attribute.Integer;
    tlIncome: Schema.Attribute.Decimal;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMemberLevelJoinDetailBinariesMemberLevelJoinDetailBinary
  extends Struct.CollectionTypeSchema {
  collectionName: 'member_level_join_detail_binaries';
  info: {
    displayName: 'Member Level Join Details Binaries';
    pluralName: 'member-level-join-detail-binaries';
    singularName: 'member-level-join-detail-binary';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::member-level-join-detail-binaries.member-level-join-detail-binary'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMemberLevelJoinDetailsMemberLevelJoinDetail
  extends Struct.CollectionTypeSchema {
  collectionName: 'member_level_join_details';
  info: {
    displayName: 'Member Level Join Details';
    pluralName: 'member-level-join-details';
    singularName: 'member-level-join-detail';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    Amount: Schema.Attribute.Decimal;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    entryDate: Schema.Attribute.DateTime;
    fromRegNo: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::member-level-join-details.member-level-join-detail'
    > &
      Schema.Attribute.Private;
    MLDID: Schema.Attribute.Integer;
    MLID: Schema.Attribute.Integer;
    publishedAt: Schema.Attribute.DateTime;
    toRegNo: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMemberLevelsMemberLevel
  extends Struct.CollectionTypeSchema {
  collectionName: 'member_levels';
  info: {
    displayName: 'Member Levels';
    pluralName: 'member-levels';
    singularName: 'member-level';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    levels: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::member-levels.member-level'
    > &
      Schema.Attribute.Private;
    mlactive: Schema.Attribute.Boolean;
    mlid: Schema.Attribute.Integer;
    paid: Schema.Attribute.Boolean;
    paid1: Schema.Attribute.Boolean;
    paid2: Schema.Attribute.Boolean;
    payid: Schema.Attribute.Integer;
    publishedAt: Schema.Attribute.DateTime;
    regno: Schema.Attribute.String;
    rlcount: Schema.Attribute.Integer;
    rlincome: Schema.Attribute.Decimal;
    tlcount: Schema.Attribute.Integer;
    tlincome: Schema.Attribute.Decimal;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMemberLoginsMemberLogin
  extends Struct.CollectionTypeSchema {
  collectionName: 'member_logins';
  info: {
    displayName: 'Member Login';
    pluralName: 'member-logins';
    singularName: 'member-login';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    active: Schema.Attribute.Boolean;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    epassword: Schema.Attribute.String;
    lastlogin: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::member-logins.member-login'
    > &
      Schema.Attribute.Private;
    loginedit: Schema.Attribute.Boolean;
    loginid: Schema.Attribute.String & Schema.Attribute.Required;
    memcode: Schema.Attribute.String;
    password: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    randomid: Schema.Attribute.String;
    regno: Schema.Attribute.String;
    rlevel: Schema.Attribute.Integer;
    secret_ans: Schema.Attribute.String;
    secret_qid: Schema.Attribute.Integer;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMemberMastersMemberMaster
  extends Struct.CollectionTypeSchema {
  collectionName: 'member_masters';
  info: {
    displayName: 'Member Master';
    pluralName: 'member-masters';
    singularName: 'member-master';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    aadhaarno: Schema.Attribute.String;
    aadhaarvaerify: Schema.Attribute.String;
    accountno: Schema.Attribute.String;
    accounttype: Schema.Attribute.String;
    active: Schema.Attribute.Boolean;
    address: Schema.Attribute.Text;
    address2: Schema.Attribute.Text;
    annual: Schema.Attribute.String;
    annualdate: Schema.Attribute.Date;
    apiacno: Schema.Attribute.String;
    apimobile: Schema.Attribute.String;
    appsm: Schema.Attribute.String;
    autopool: Schema.Attribute.String;
    bank_check: Schema.Attribute.String;
    bankaddress: Schema.Attribute.String;
    bankname: Schema.Attribute.String;
    bankverify: Schema.Attribute.String;
    binaryregno: Schema.Attribute.String;
    blevel: Schema.Attribute.Integer;
    boardstatus: Schema.Attribute.String;
    branch: Schema.Attribute.String;
    branchcity: Schema.Attribute.String;
    branchcode: Schema.Attribute.String;
    branchname: Schema.Attribute.String;
    brequestno: Schema.Attribute.String;
    brid: Schema.Attribute.Integer;
    childcount: Schema.Attribute.Integer;
    chk_dft_date: Schema.Attribute.Date;
    chk_dft_ref_no: Schema.Attribute.String;
    cid: Schema.Attribute.Integer;
    club: Schema.Attribute.String;
    clubdate: Schema.Attribute.Date;
    commentonactive: Schema.Attribute.Text;
    companybank: Schema.Attribute.String;
    confpayno: Schema.Attribute.String;
    corebank: Schema.Attribute.String;
    corebankcity: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    depthsb: Schema.Attribute.Integer;
    depthsm: Schema.Attribute.Integer;
    directmembers: Schema.Attribute.Integer;
    distname: Schema.Attribute.String;
    district: Schema.Attribute.String;
    dlpayid: Schema.Attribute.String;
    dob: Schema.Attribute.Date;
    doc: Schema.Attribute.Date;
    document_attest: Schema.Attribute.String;
    education: Schema.Attribute.String;
    educationdate: Schema.Attribute.Date;
    emailid: Schema.Attribute.String;
    ezokart: Schema.Attribute.String;
    fat_husname: Schema.Attribute.String;
    fax: Schema.Attribute.String;
    firstpassword: Schema.Attribute.String;
    firsts_ans: Schema.Attribute.String;
    firsts_qid: Schema.Attribute.String;
    fname: Schema.Attribute.String;
    gender: Schema.Attribute.String;
    husbandname: Schema.Attribute.String;
    ifsccode: Schema.Attribute.String;
    igtserialno: Schema.Attribute.String;
    inboard: Schema.Attribute.String;
    inboardregno: Schema.Attribute.String;
    introchild1: Schema.Attribute.String;
    introchild2: Schema.Attribute.String;
    introposm: Schema.Attribute.String;
    introreflecttoregno: Schema.Attribute.String;
    introrefwing: Schema.Attribute.String;
    introregno: Schema.Attribute.String;
    introside: Schema.Attribute.String;
    isdcode: Schema.Attribute.String;
    joinas: Schema.Attribute.String;
    jointype: Schema.Attribute.String;
    kid: Schema.Attribute.Integer;
    kitbv: Schema.Attribute.Decimal;
    kitprice: Schema.Attribute.Decimal;
    kitpv: Schema.Attribute.Decimal;
    kycuuploadstatus: Schema.Attribute.String;
    kycuuploadstatusp: Schema.Attribute.String;
    landmark: Schema.Attribute.String;
    ldirect: Schema.Attribute.Integer;
    lname: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::member-masters.member-master'
    > &
      Schema.Attribute.Private;
    loginid: Schema.Attribute.String;
    lvlid: Schema.Attribute.Integer;
    mannual: Schema.Attribute.String;
    mbentry: Schema.Attribute.String;
    medical: Schema.Attribute.String;
    medicaldate: Schema.Attribute.Date;
    membership: Schema.Attribute.String;
    memcode: Schema.Attribute.String;
    mempan: Schema.Attribute.String;
    mobile: Schema.Attribute.String;
    mssql_ctid: Schema.Attribute.String;
    mstatus: Schema.Attribute.String;
    nameonaccount: Schema.Attribute.String;
    nameonpan: Schema.Attribute.String;
    nomdob: Schema.Attribute.Date;
    nomidno: Schema.Attribute.String;
    nomidtype: Schema.Attribute.String;
    nomname: Schema.Attribute.String;
    nomndob: Schema.Attribute.String;
    ocity: Schema.Attribute.String;
    ostate: Schema.Attribute.String;
    pan_check: Schema.Attribute.String;
    panverify: Schema.Attribute.String;
    parentposb: Schema.Attribute.String;
    parentposm: Schema.Attribute.String;
    parentregnob: Schema.Attribute.String;
    parentregnom: Schema.Attribute.String;
    parentsideb: Schema.Attribute.String;
    paychqdate: Schema.Attribute.Date;
    paychqno: Schema.Attribute.String;
    payment_release_approval: Schema.Attribute.String;
    paymentmode: Schema.Attribute.String;
    paymode: Schema.Attribute.String;
    pcollectby: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    pincode: Schema.Attribute.String;
    ppositionm: Schema.Attribute.String;
    productcode: Schema.Attribute.String;
    productname: Schema.Attribute.String;
    profession: Schema.Attribute.String;
    profileimage: Schema.Attribute.String;
    proplocationid: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    purchedate: Schema.Attribute.Date;
    qualification: Schema.Attribute.String;
    quantity: Schema.Attribute.Integer;
    randomid: Schema.Attribute.String;
    rdirect: Schema.Attribute.Integer;
    refdate: Schema.Attribute.Date;
    reflection1: Schema.Attribute.String;
    reflection2: Schema.Attribute.String;
    reflegside: Schema.Attribute.String;
    refno: Schema.Attribute.String;
    reftoregno: Schema.Attribute.String;
    regdate: Schema.Attribute.Date;
    regno: Schema.Attribute.String;
    regpayno: Schema.Attribute.String;
    relation: Schema.Attribute.String;
    repurchasepool: Schema.Attribute.String;
    requestno: Schema.Attribute.String;
    securitycode: Schema.Attribute.String;
    seen: Schema.Attribute.Boolean;
    sid: Schema.Attribute.Integer;
    smpayid: Schema.Attribute.String;
    spid: Schema.Attribute.String;
    swiftcode: Schema.Attribute.String;
    tempdob: Schema.Attribute.Date;
    title: Schema.Attribute.String;
    travel: Schema.Attribute.String;
    traveldate: Schema.Attribute.Date;
    updateby: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedate: Schema.Attribute.Date;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    upline: Schema.Attribute.String;
    upline1: Schema.Attribute.String;
    uplinedate: Schema.Attribute.Date;
    uplinepayid: Schema.Attribute.String;
    user: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    useridno: Schema.Attribute.String;
    useridtype: Schema.Attribute.String;
  };
}

export interface ApiMemberPaymentDetailsMemberPaymentDetail
  extends Struct.CollectionTypeSchema {
  collectionName: 'member_payment_details';
  info: {
    displayName: 'Member Payment Details';
    pluralName: 'member-payment-details';
    singularName: 'member-payment-detail';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    handlingamount: Schema.Attribute.Decimal;
    handlingrate: Schema.Attribute.Decimal;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::member-payment-details.member-payment-detail'
    > &
      Schema.Attribute.Private;
    netamount: Schema.Attribute.Decimal;
    ptrdid: Schema.Attribute.Integer;
    ptrid: Schema.Attribute.Integer;
    publishedAt: Schema.Attribute.DateTime;
    regno: Schema.Attribute.String;
    tdsamount: Schema.Attribute.Decimal;
    tdsrate: Schema.Attribute.Decimal;
    tramount: Schema.Attribute.Decimal;
    trappby: Schema.Attribute.String;
    trappdate: Schema.Attribute.DateTime;
    trbankname: Schema.Attribute.String;
    trcomment: Schema.Attribute.Text;
    trdate: Schema.Attribute.DateTime;
    trentrydate: Schema.Attribute.DateTime;
    trpaymode: Schema.Attribute.String;
    trrefno: Schema.Attribute.String;
    trstatus: Schema.Attribute.Integer;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMemberPayoutDetailsMemberPayoutDetail
  extends Struct.CollectionTypeSchema {
  collectionName: 'member_payout_details';
  info: {
    displayName: 'Member Payout Details';
    pluralName: 'member-payout-details';
    singularName: 'member-payout-detail';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    boosterincome: Schema.Attribute.Decimal;
    conflside: Schema.Attribute.Integer;
    confrside: Schema.Attribute.Integer;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dbv: Schema.Attribute.Decimal;
    designation: Schema.Attribute.String;
    designationdate: Schema.Attribute.DateTime;
    diff_income: Schema.Attribute.Decimal;
    diffincome: Schema.Attribute.Decimal;
    directincome: Schema.Attribute.Decimal;
    directpv: Schema.Attribute.Decimal;
    firstpair: Schema.Attribute.Integer;
    flushpair: Schema.Attribute.Integer;
    flushpv: Schema.Attribute.Decimal;
    gbv: Schema.Attribute.Decimal;
    hamount: Schema.Attribute.Decimal;
    hrate: Schema.Attribute.Decimal;
    l10count: Schema.Attribute.Integer;
    l10income: Schema.Attribute.Decimal;
    l1count: Schema.Attribute.Integer;
    l1income: Schema.Attribute.Decimal;
    l2count: Schema.Attribute.Integer;
    l2income: Schema.Attribute.Decimal;
    l3count: Schema.Attribute.Integer;
    l3income: Schema.Attribute.Decimal;
    l4count: Schema.Attribute.Integer;
    l4income: Schema.Attribute.Decimal;
    l5count: Schema.Attribute.Integer;
    l5income: Schema.Attribute.Decimal;
    l6count: Schema.Attribute.Integer;
    l6income: Schema.Attribute.Decimal;
    l7count: Schema.Attribute.Integer;
    l7income: Schema.Attribute.Decimal;
    l8count: Schema.Attribute.Integer;
    l8income: Schema.Attribute.Decimal;
    l9count: Schema.Attribute.Integer;
    l9income: Schema.Attribute.Decimal;
    lcount: Schema.Attribute.Integer;
    leadershipincome: Schema.Attribute.Decimal;
    lefttail: Schema.Attribute.Integer;
    levelincome: Schema.Attribute.Decimal;
    levelincomeb: Schema.Attribute.Decimal;
    levelincomed: Schema.Attribute.Decimal;
    lgray: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::member-payout-details.member-payout-detail'
    > &
      Schema.Attribute.Private;
    lproductpv: Schema.Attribute.Decimal;
    lpv: Schema.Attribute.Decimal;
    netamount: Schema.Attribute.Decimal;
    network_income: Schema.Attribute.Decimal;
    override_income: Schema.Attribute.Decimal;
    paid: Schema.Attribute.Integer;
    paidpair: Schema.Attribute.Integer;
    paidproductpv: Schema.Attribute.Decimal;
    paidpv: Schema.Attribute.Decimal;
    paircutting: Schema.Attribute.Integer;
    payid: Schema.Attribute.Integer;
    pbv: Schema.Attribute.Decimal;
    publishedAt: Schema.Attribute.DateTime;
    pvincome: Schema.Attribute.Decimal;
    rbv: Schema.Attribute.Decimal;
    rcount: Schema.Attribute.Integer;
    regno: Schema.Attribute.String;
    rgray: Schema.Attribute.Integer;
    righttail: Schema.Attribute.Integer;
    rproductpv: Schema.Attribute.Decimal;
    rpv: Schema.Attribute.Decimal;
    servicecharge: Schema.Attribute.Decimal;
    singlecount: Schema.Attribute.Integer;
    singlelegdeduction: Schema.Attribute.Decimal;
    singlelegincome: Schema.Attribute.Decimal;
    slabpair: Schema.Attribute.Integer;
    slabpv: Schema.Attribute.Decimal;
    tds: Schema.Attribute.Decimal;
    tdsamount: Schema.Attribute.Decimal;
    tdsrate: Schema.Attribute.Decimal;
    tdswp: Schema.Attribute.Decimal;
    totalincome: Schema.Attribute.Decimal;
    totallside: Schema.Attribute.Integer;
    totalrside: Schema.Attribute.Integer;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMemberPayoutsMemberPayout
  extends Struct.CollectionTypeSchema {
  collectionName: 'member_payouts';
  info: {
    displayName: 'Member Payouts';
    pluralName: 'member-payouts';
    singularName: 'member-payout';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    boosterincome: Schema.Attribute.Decimal;
    conflside: Schema.Attribute.Integer;
    confrside: Schema.Attribute.Integer;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dbv: Schema.Attribute.Decimal;
    designation: Schema.Attribute.String;
    designationdate: Schema.Attribute.DateTime;
    diff_income: Schema.Attribute.Decimal;
    diffincome: Schema.Attribute.Decimal;
    directincome: Schema.Attribute.Decimal;
    directpv: Schema.Attribute.Decimal;
    firstpair: Schema.Attribute.Integer;
    flushpair: Schema.Attribute.Integer;
    flushpv: Schema.Attribute.Decimal;
    gbv: Schema.Attribute.Decimal;
    hamount: Schema.Attribute.Decimal;
    hrate: Schema.Attribute.Decimal;
    l10count: Schema.Attribute.Integer;
    l10income: Schema.Attribute.Decimal;
    l1count: Schema.Attribute.Integer;
    l1income: Schema.Attribute.Decimal;
    l2count: Schema.Attribute.Integer;
    l2income: Schema.Attribute.Decimal;
    l3count: Schema.Attribute.Integer;
    l3income: Schema.Attribute.Decimal;
    l4count: Schema.Attribute.Integer;
    l4income: Schema.Attribute.Decimal;
    l5count: Schema.Attribute.Integer;
    l5income: Schema.Attribute.Decimal;
    l6count: Schema.Attribute.Integer;
    l6income: Schema.Attribute.Decimal;
    l7count: Schema.Attribute.Integer;
    l7income: Schema.Attribute.Decimal;
    l8count: Schema.Attribute.Integer;
    l8income: Schema.Attribute.Decimal;
    l9count: Schema.Attribute.Integer;
    l9income: Schema.Attribute.Decimal;
    lcount: Schema.Attribute.Integer;
    leadershipincome: Schema.Attribute.Decimal;
    lefttail: Schema.Attribute.Integer;
    levelincome: Schema.Attribute.Decimal;
    levelincomeb: Schema.Attribute.Decimal;
    levelincomed: Schema.Attribute.Decimal;
    lgray: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::member-payouts.member-payout'
    > &
      Schema.Attribute.Private;
    lproductpv: Schema.Attribute.Decimal;
    lpv: Schema.Attribute.Decimal;
    netamount: Schema.Attribute.Decimal;
    network_income: Schema.Attribute.Decimal;
    override_income: Schema.Attribute.Decimal;
    paid: Schema.Attribute.Integer;
    paidpair: Schema.Attribute.Integer;
    paidproductpv: Schema.Attribute.Decimal;
    paidpv: Schema.Attribute.Decimal;
    paircutting: Schema.Attribute.Integer;
    payid: Schema.Attribute.Integer;
    pbv: Schema.Attribute.Decimal;
    publishedAt: Schema.Attribute.DateTime;
    pvincome: Schema.Attribute.Decimal;
    rbv: Schema.Attribute.Decimal;
    rcount: Schema.Attribute.Integer;
    regno: Schema.Attribute.String;
    rgray: Schema.Attribute.Integer;
    righttail: Schema.Attribute.Integer;
    rproductpv: Schema.Attribute.Decimal;
    rpv: Schema.Attribute.Decimal;
    servicecharge: Schema.Attribute.Decimal;
    shoppingcharge: Schema.Attribute.Decimal;
    singlecount: Schema.Attribute.Integer;
    singlelegdeduction: Schema.Attribute.Decimal;
    singlelegincome: Schema.Attribute.Decimal;
    slabpair: Schema.Attribute.Integer;
    slabpv: Schema.Attribute.Decimal;
    tds: Schema.Attribute.Decimal;
    tdsamount: Schema.Attribute.Decimal;
    tdsrate: Schema.Attribute.Decimal;
    tdswp: Schema.Attribute.Decimal;
    totalincome: Schema.Attribute.Decimal;
    totallside: Schema.Attribute.Integer;
    totalrside: Schema.Attribute.Integer;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMemberSettlementAccountsMemberSettlementAccount
  extends Struct.CollectionTypeSchema {
  collectionName: 'member_settlement_accounts';
  info: {
    displayName: 'Member Settlement Accounts';
    pluralName: 'member-settlement-accounts';
    singularName: 'member-settlement-account';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    accountname: Schema.Attribute.String;
    accountno: Schema.Attribute.String;
    accounttype: Schema.Attribute.String;
    acid: Schema.Attribute.Integer;
    adjustment: Schema.Attribute.Decimal;
    bankname: Schema.Attribute.String;
    banktransid: Schema.Attribute.String;
    bid: Schema.Attribute.Integer;
    branchcode: Schema.Attribute.String;
    branchname: Schema.Attribute.String;
    brequestno: Schema.Attribute.String;
    clientid: Schema.Attribute.String;
    couponno: Schema.Attribute.String;
    crdb: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    credit: Schema.Attribute.Decimal;
    debit: Schema.Attribute.Decimal;
    empirecallsid: Schema.Attribute.String;
    errormessage: Schema.Attribute.Text;
    handlingcharge: Schema.Attribute.Decimal;
    handlingrate: Schema.Attribute.Decimal;
    ifsccode: Schema.Attribute.String;
    impsrefno: Schema.Attribute.String;
    ip: Schema.Attribute.String;
    levelincomerp: Schema.Attribute.Decimal;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::member-settlement-accounts.member-settlement-account'
    > &
      Schema.Attribute.Private;
    lockfordisplay: Schema.Attribute.Boolean;
    lockforpayment: Schema.Attribute.Boolean;
    mpoid: Schema.Attribute.Integer;
    netpayable: Schema.Attribute.Decimal;
    othercharge: Schema.Attribute.Decimal;
    paid: Schema.Attribute.Integer;
    payid: Schema.Attribute.Integer;
    payidsindex: Schema.Attribute.Integer;
    paymentdate: Schema.Attribute.DateTime;
    paymode: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    referenceno: Schema.Attribute.String;
    refno: Schema.Attribute.String;
    regno: Schema.Attribute.String;
    remark: Schema.Attribute.Text;
    requestno: Schema.Attribute.String;
    rid: Schema.Attribute.Integer;
    rstatus: Schema.Attribute.String;
    seen: Schema.Attribute.Boolean;
    swiftcode: Schema.Attribute.String;
    tdsamount: Schema.Attribute.Decimal;
    tdsrate: Schema.Attribute.Decimal;
    tramount: Schema.Attribute.Decimal;
    transactionid: Schema.Attribute.String;
    transdate: Schema.Attribute.DateTime;
    transferid: Schema.Attribute.String;
    transferstatus: Schema.Attribute.String;
    transno: Schema.Attribute.String;
    transtype: Schema.Attribute.String;
    trappby: Schema.Attribute.String;
    trappdate: Schema.Attribute.DateTime;
    trcode: Schema.Attribute.String;
    trct: Schema.Attribute.String;
    trdate: Schema.Attribute.DateTime;
    trkid: Schema.Attribute.Integer;
    trmobile: Schema.Attribute.String;
    trqty: Schema.Attribute.Integer;
    trrtype: Schema.Attribute.String;
    trsp: Schema.Attribute.String;
    trstatus: Schema.Attribute.Integer;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMentorMentor extends Struct.CollectionTypeSchema {
  collectionName: 'mentors';
  info: {
    displayName: 'Mentor';
    pluralName: 'mentors';
    singularName: 'mentor';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    designation: Schema.Attribute.String & Schema.Attribute.Required;
    facebook: Schema.Attribute.String;
    Instagram: Schema.Attribute.String;
    linkedin: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::mentor.mentor'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    webinars: Schema.Attribute.Relation<'oneToMany', 'api::webinar.webinar'>;
    x: Schema.Attribute.String;
  };
}

export interface ApiMessageMessage extends Struct.CollectionTypeSchema {
  collectionName: 'messages';
  info: {
    displayName: 'Message';
    pluralName: 'messages';
    singularName: 'message';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    attachments: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    file: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    is_community: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::message.message'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    receiver: Schema.Attribute.String;
    sender: Schema.Attribute.String;
    text: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiNotificationsNotification
  extends Struct.CollectionTypeSchema {
  collectionName: 'notifications';
  info: {
    description: 'Stores notification logs for emails like payment success and demo booking';
    displayName: 'Notification';
    pluralName: 'notifications';
    singularName: 'notification';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    errorMessage: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::notifications.notification'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPaymentPayment extends Struct.CollectionTypeSchema {
  collectionName: 'payments';
  info: {
    displayName: 'Payment';
    pluralName: 'payments';
    singularName: 'payment';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    address: Schema.Attribute.String;
    admin_comment: Schema.Attribute.String;
    bank_name: Schema.Attribute.String;
    base_price: Schema.Attribute.Decimal;
    cgst: Schema.Attribute.Decimal;
    city: Schema.Attribute.String;
    commissions: Schema.Attribute.Relation<
      'oneToMany',
      'api::commission.commission'
    >;
    course: Schema.Attribute.Relation<
      'manyToOne',
      'api::recorderd-lecture.recorderd-lecture'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    currency: Schema.Attribute.String;
    district: Schema.Attribute.String;
    email: Schema.Attribute.Email;
    gst: Schema.Attribute.Decimal;
    invoice_no: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::payment.payment'
    > &
      Schema.Attribute.Private;
    mpoid: Schema.Attribute.String;
    name: Schema.Attribute.String;
    order_id: Schema.Attribute.UID;
    order_no: Schema.Attribute.String;
    payment_date: Schema.Attribute.DateTime;
    payment_id: Schema.Attribute.UID;
    payment_mode: Schema.Attribute.Enumeration<
      [
        'RAZORPAY',
        'HDFC',
        'DIGITAL_PAYMENT',
        'BANK_DEPOSIT',
        'ONLINE_TRANSFER',
        'CASH',
      ]
    >;
    payment_receipt: Schema.Attribute.String;
    payment_status: Schema.Attribute.Enumeration<
      [
        'SUCCESS',
        'FAILED',
        'REJECTED',
        'PENDING',
        'UNDER_VERIFICATION',
        'REFUND_REQ',
        'REFUNDED',
      ]
    > &
      Schema.Attribute.DefaultTo<'UNDER_VERIFICATION'>;
    phone: Schema.Attribute.String;
    pincode: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    purchased_course: Schema.Attribute.Relation<
      'oneToOne',
      'api::purchased-course.purchased-course'
    >;
    ref_no: Schema.Attribute.String;
    refund: Schema.Attribute.Relation<'oneToOne', 'api::refund.refund'>;
    regno: Schema.Attribute.String;
    sgst: Schema.Attribute.Decimal;
    total_amount: Schema.Attribute.Decimal;
    transaction_id: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    verified_at: Schema.Attribute.DateTime;
  };
}

export interface ApiPayoutPayout extends Struct.CollectionTypeSchema {
  collectionName: 'payouts';
  info: {
    displayName: 'Payout';
    pluralName: 'payouts';
    singularName: 'payout';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    admin_charges: Schema.Attribute.Decimal;
    admin_remarks: Schema.Attribute.String;
    available_amount: Schema.Attribute.Decimal & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deduct_remarks: Schema.Attribute.String;
    fromDate: Schema.Attribute.Date;
    kyc_document: Schema.Attribute.Relation<
      'manyToOne',
      'api::kyc-document.kyc-document'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::payout.payout'
    > &
      Schema.Attribute.Private;
    net_payable_amount: Schema.Attribute.Decimal;
    paid_date: Schema.Attribute.DateTime;
    payout_status: Schema.Attribute.Enumeration<
      ['REQUESTED', 'PAID', 'REJECTED']
    >;
    publishedAt: Schema.Attribute.DateTime;
    regno: Schema.Attribute.String;
    remark: Schema.Attribute.Text;
    request_date: Schema.Attribute.DateTime;
    tds_charges: Schema.Attribute.Decimal;
    toDate: Schema.Attribute.Date;
    total_amount: Schema.Attribute.Decimal & Schema.Attribute.Required;
    transaction_amount: Schema.Attribute.Decimal;
    transaction_code: Schema.Attribute.String;
    transaction_history: Schema.Attribute.Relation<
      'oneToOne',
      'api::transaction-history.transaction-history'
    >;
    transaction_type: Schema.Attribute.Enumeration<['DEDUCT', 'WITHDRAW']>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    wallet: Schema.Attribute.Relation<'manyToOne', 'api::wallet.wallet'>;
    withdraw_amount: Schema.Attribute.Decimal & Schema.Attribute.Required;
  };
}

export interface ApiProductOrderDetailsProductOrderDetail
  extends Struct.CollectionTypeSchema {
  collectionName: 'product_order_details';
  info: {
    displayName: 'Product Order Details';
    pluralName: 'product-order-details';
    singularName: 'product-order-detail';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    Bv: Schema.Attribute.Decimal;
    categoryid: Schema.Attribute.Integer;
    CGST: Schema.Attribute.Decimal;
    Color: Schema.Attribute.String;
    companyDiscount: Schema.Attribute.Decimal;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    DirectDiscount: Schema.Attribute.Decimal;
    directDiscountRate: Schema.Attribute.Decimal;
    discount: Schema.Attribute.Decimal;
    discountPer: Schema.Attribute.Decimal;
    DP: Schema.Attribute.Decimal;
    ExpiryDate: Schema.Attribute.Date;
    fodp: Schema.Attribute.Decimal;
    GST: Schema.Attribute.Decimal;
    IGST: Schema.Attribute.Decimal;
    legacy_payload: Schema.Attribute.JSON;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::product-order-details.product-order-detail'
    > &
      Schema.Attribute.Private;
    MarketingExpense: Schema.Attribute.Decimal;
    MID: Schema.Attribute.Integer;
    MPOID: Schema.Attribute.Integer;
    MRP: Schema.Attribute.Decimal;
    OWHP: Schema.Attribute.Decimal;
    PFund: Schema.Attribute.Decimal;
    points: Schema.Attribute.Decimal;
    Product_Discription: Schema.Attribute.Text;
    ProductID: Schema.Attribute.Integer;
    ProductType: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    Quantity: Schema.Attribute.Integer;
    SGST: Schema.Attribute.Decimal;
    ShipCharge: Schema.Attribute.Decimal;
    Size: Schema.Attribute.String;
    slid: Schema.Attribute.Integer;
    StockistProComm: Schema.Attribute.Decimal;
    SWHP: Schema.Attribute.Decimal;
    TotalAmount: Schema.Attribute.Decimal;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    VAT: Schema.Attribute.Decimal;
    VATRate: Schema.Attribute.Decimal;
  };
}

export interface ApiProductOrdersProductOrder
  extends Struct.CollectionTypeSchema {
  collectionName: 'product_orders';
  info: {
    displayName: 'Product Orders';
    pluralName: 'product-orders';
    singularName: 'product-order';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    bankname: Schema.Attribute.String;
    CGST: Schema.Attribute.Decimal;
    couponDiscount: Schema.Attribute.Decimal;
    created_at_legacy: Schema.Attribute.DateTime;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    currency: Schema.Attribute.String & Schema.Attribute.DefaultTo<'INR'>;
    Discount: Schema.Attribute.Decimal;
    dispatchComment: Schema.Attribute.Text;
    dispatchdate: Schema.Attribute.DateTime;
    IGST: Schema.Attribute.Decimal;
    invDate: Schema.Attribute.DateTime;
    invNo: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::product-orders.product-order'
    > &
      Schema.Attribute.Private;
    MPOID: Schema.Attribute.Integer;
    order_remark: Schema.Attribute.Text;
    OrderDate: Schema.Attribute.DateTime;
    OrderNo: Schema.Attribute.String;
    paymentdate: Schema.Attribute.DateTime;
    paymentmode: Schema.Attribute.String;
    paymentStatus: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    razorpay_order_id: Schema.Attribute.String;
    razorpay_payment_id: Schema.Attribute.String;
    razorpay_signature: Schema.Attribute.String;
    refno: Schema.Attribute.String;
    Saddress: Schema.Attribute.Text;
    Scity: Schema.Attribute.String;
    Semail: Schema.Attribute.Email;
    SGST: Schema.Attribute.Decimal;
    shipCharge: Schema.Attribute.Decimal;
    SName: Schema.Attribute.String;
    SPhone: Schema.Attribute.String;
    Spincode: Schema.Attribute.String;
    SState: Schema.Attribute.String;
    Status: Schema.Attribute.String;
    TaxAmt: Schema.Attribute.Decimal;
    TaxRate: Schema.Attribute.Decimal;
    TotalAmount: Schema.Attribute.Decimal;
    totalquantity: Schema.Attribute.Integer;
    trackingno: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPurchasedCoursePurchasedCourse
  extends Struct.CollectionTypeSchema {
  collectionName: 'purchased_courses';
  info: {
    displayName: 'Purchased Course';
    pluralName: 'purchased-courses';
    singularName: 'purchased-course';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    access_status: Schema.Attribute.Enumeration<
      ['active', 'expired', 'refunded', 'blocked']
    >;
    course: Schema.Attribute.Relation<
      'manyToOne',
      'api::recorderd-lecture.recorderd-lecture'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dp: Schema.Attribute.Decimal;
    expiry_date: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::purchased-course.purchased-course'
    > &
      Schema.Attribute.Private;
    mpoid: Schema.Attribute.String;
    mrp: Schema.Attribute.Decimal;
    payment: Schema.Attribute.Relation<'oneToOne', 'api::payment.payment'>;
    product_id: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    purchased_date: Schema.Attribute.DateTime;
    quiz_scores: Schema.Attribute.Relation<
      'oneToMany',
      'api::quiz-score.quiz-score'
    >;
    refunds: Schema.Attribute.Relation<'oneToMany', 'api::refund.refund'>;
    regno: Schema.Attribute.String;
    total_amount: Schema.Attribute.Decimal;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    video_progresses: Schema.Attribute.Relation<
      'oneToMany',
      'api::video-progress.video-progress'
    >;
  };
}

export interface ApiQuizScoreQuizScore extends Struct.CollectionTypeSchema {
  collectionName: 'quiz_scores';
  info: {
    displayName: 'Quiz Score';
    pluralName: 'quiz-scores';
    singularName: 'quiz-score';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    answers: Schema.Attribute.JSON;
    attempt_no: Schema.Attribute.Integer;
    course: Schema.Attribute.Relation<
      'oneToMany',
      'api::recorderd-lecture.recorderd-lecture'
    >;
    course_modules: Schema.Attribute.Relation<
      'manyToOne',
      'api::course-module.course-module'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    is_passed: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::quiz-score.quiz-score'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    purchased_course: Schema.Attribute.Relation<
      'manyToOne',
      'api::purchased-course.purchased-course'
    >;
    quiz: Schema.Attribute.Relation<'manyToOne', 'api::quiz.quiz'>;
    score: Schema.Attribute.Decimal;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiQuizQuiz extends Struct.CollectionTypeSchema {
  collectionName: 'quizzes';
  info: {
    displayName: 'Quiz';
    pluralName: 'quizzes';
    singularName: 'quiz';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    category: Schema.Attribute.Enumeration<['basic', 'fibonacci', 'advanced']>;
    course_categories: Schema.Attribute.Relation<
      'oneToMany',
      'api::course-category.course-category'
    >;
    course_module: Schema.Attribute.Relation<
      'oneToOne',
      'api::course-module.course-module'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Blocks;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::quiz.quiz'> &
      Schema.Attribute.Private;
    passing_percentage: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    questions: Schema.Attribute.Component<'mcq.quiz', true>;
    quiz_scores: Schema.Attribute.Relation<
      'oneToMany',
      'api::quiz-score.quiz-score'
    >;
    recorderd_lecture: Schema.Attribute.Relation<
      'oneToOne',
      'api::recorderd-lecture.recorderd-lecture'
    >;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users_permissions_users: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiRecorderdLectureRecorderdLecture
  extends Struct.CollectionTypeSchema {
  collectionName: 'recorderd_lectures';
  info: {
    displayName: 'Recorderd Lecture';
    pluralName: 'recorderd-lectures';
    singularName: 'recorderd-lecture';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    catalogue_key: Schema.Attribute.Enumeration<
      ['foundation', 'advanced', 'premium', 'news_trading', 'one_to_one']
    >;
    cgst: Schema.Attribute.Decimal;
    course_category: Schema.Attribute.Relation<
      'manyToOne',
      'api::course-category.course-category'
    >;
    course_desc: Schema.Attribute.String & Schema.Attribute.Required;
    course_modules: Schema.Attribute.Relation<
      'oneToMany',
      'api::course-module.course-module'
    >;
    course_price: Schema.Attribute.Integer;
    course_progress: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 0;
        },
        number
      >;
    course_resources_desc: Schema.Attribute.Text;
    course_resources_download: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    course_resources_title: Schema.Attribute.String;
    course_thumbnail: Schema.Attribute.Media<'images' | 'files'>;
    course_title: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    feedback: Schema.Attribute.Decimal;
    folderPath: Schema.Attribute.JSON;
    gst: Schema.Attribute.BigInteger;
    length: Schema.Attribute.Decimal;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::recorderd-lecture.recorderd-lecture'
    > &
      Schema.Attribute.Private;
    module_id: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    mrp: Schema.Attribute.Decimal;
    offline_course: Schema.Attribute.Boolean;
    payments: Schema.Attribute.Relation<'oneToMany', 'api::payment.payment'>;
    playlist: Schema.Attribute.JSON;
    posters: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    purchased_courses: Schema.Attribute.Relation<
      'oneToMany',
      'api::purchased-course.purchased-course'
    >;
    quiz: Schema.Attribute.Relation<'oneToOne', 'api::quiz.quiz'>;
    quiz_score: Schema.Attribute.Relation<
      'manyToOne',
      'api::quiz-score.quiz-score'
    >;
    regular_price: Schema.Attribute.Decimal;
    sgst: Schema.Attribute.Decimal;
    teacher: Schema.Attribute.Relation<'manyToOne', 'api::teacher.teacher'>;
    thumbnail_img_path: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    vdo_id: Schema.Attribute.UID;
    video_url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ApiReferralTreeReferralTree
  extends Struct.CollectionTypeSchema {
  collectionName: 'referral_trees';
  info: {
    displayName: 'Referral Tree';
    pluralName: 'referral-trees';
    singularName: 'referral-tree';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    childAffiliate: Schema.Attribute.Integer;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    level: Schema.Attribute.Component<'all-levels.all-levels-component', true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::referral-tree.referral-tree'
    > &
      Schema.Attribute.Private;
    parentAffiliate: Schema.Attribute.Integer;
    publishedAt: Schema.Attribute.DateTime;
    referralBy: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    referrals: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiRefundRefund extends Struct.CollectionTypeSchema {
  collectionName: 'refunds';
  info: {
    displayName: 'Refund';
    pluralName: 'refunds';
    singularName: 'refund';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    admin_comment: Schema.Attribute.String;
    course: Schema.Attribute.Relation<
      'manyToOne',
      'api::purchased-course.purchased-course'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::refund.refund'
    > &
      Schema.Attribute.Private;
    payment: Schema.Attribute.Relation<'oneToOne', 'api::payment.payment'>;
    proccessed_at: Schema.Attribute.DateTime;
    publishedAt: Schema.Attribute.DateTime;
    refund_reason: Schema.Attribute.String & Schema.Attribute.Required;
    refund_status: Schema.Attribute.Enumeration<
      ['pending', 'approved', 'rejected']
    > &
      Schema.Attribute.Required;
    requested_at: Schema.Attribute.DateTime & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiStudentDashboardStudentDashboard
  extends Struct.CollectionTypeSchema {
  collectionName: 'student_dashboards';
  info: {
    displayName: 'Student Dashboard';
    pluralName: 'student-dashboards';
    singularName: 'student-dashboard';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::student-dashboard.student-dashboard'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiStudentLibraryStudentLibrary
  extends Struct.CollectionTypeSchema {
  collectionName: 'student_libraries';
  info: {
    displayName: 'Student Library';
    pluralName: 'student-libraries';
    singularName: 'student-library';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    documents_file: Schema.Attribute.Media<'images' | 'files'> &
      Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::student-library.student-library'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiTblBinaryVolumesTblBinaryVolume
  extends Struct.CollectionTypeSchema {
  collectionName: 'tbl_binary_volumes';
  info: {
    displayName: 'Tbl Binary Volumes';
    pluralName: 'tbl-binary-volumes';
    singularName: 'tbl-binary-volume';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    adid: Schema.Attribute.Integer;
    childregno: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    id_old: Schema.Attribute.Integer;
    insertdate: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::tbl-binary-volumes.tbl-binary-volume'
    > &
      Schema.Attribute.Private;
    promobv: Schema.Attribute.Decimal;
    publishedAt: Schema.Attribute.DateTime;
    regno: Schema.Attribute.String;
    remark: Schema.Attribute.Text;
    side: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTblKycCompletesTblKycComplete
  extends Struct.CollectionTypeSchema {
  collectionName: 'tbl_kyc_completes';
  info: {
    displayName: 'Tbl Kyc Completes';
    pluralName: 'tbl-kyc-completes';
    singularName: 'tbl-kyc-complete';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::tbl-kyc-completes.tbl-kyc-complete'
    > &
      Schema.Attribute.Private;
    loginid: Schema.Attribute.String;
    name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    regno: Schema.Attribute.String & Schema.Attribute.Required;
    status: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTblKycDocumentsTblKycDocument
  extends Struct.CollectionTypeSchema {
  collectionName: 'tbl_kyc_documents';
  info: {
    displayName: 'Tbl Kyc Documents';
    pluralName: 'tbl-kyc-documents';
    singularName: 'tbl-kyc-document';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    cdate: Schema.Attribute.DateTime;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    docfilename: Schema.Attribute.String;
    docstatus: Schema.Attribute.Integer;
    documentname: Schema.Attribute.String;
    documentno: Schema.Attribute.String;
    ifsccode: Schema.Attribute.String;
    kycid_old: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::tbl-kyc-documents.tbl-kyc-document'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    regno: Schema.Attribute.String;
    remark: Schema.Attribute.Text;
    swiftcode: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTblKycStatusMembersTblKycStatusMember
  extends Struct.CollectionTypeSchema {
  collectionName: 'tbl_kyc_status_members';
  info: {
    displayName: 'Tbl Kyc Status Members';
    pluralName: 'tbl-kyc-status-members';
    singularName: 'tbl-kyc-status-member';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    cstatus: Schema.Attribute.String;
    kycpart: Schema.Attribute.String;
    kycpartid: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::tbl-kyc-status-members.tbl-kyc-status-member'
    > &
      Schema.Attribute.Private;
    loginid: Schema.Attribute.String;
    name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    regdate: Schema.Attribute.DateTime;
    regno: Schema.Attribute.String & Schema.Attribute.Required;
    selfapprovaldate: Schema.Attribute.DateTime;
    statusid: Schema.Attribute.Integer;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    verifydate: Schema.Attribute.DateTime;
  };
}

export interface ApiTblSponsorLogsTblSponsorLog
  extends Struct.CollectionTypeSchema {
  collectionName: 'tbl_sponsor_logs';
  info: {
    displayName: 'Tbl Sponsor Logs';
    pluralName: 'tbl-sponsor-logs';
    singularName: 'tbl-sponsor-log';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::tbl-sponsor-logs.tbl-sponsor-log'
    > &
      Schema.Attribute.Private;
    newsregno: Schema.Attribute.String;
    oldsregno: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    regno: Schema.Attribute.String;
    sponsorlogid_old: Schema.Attribute.Integer;
    udate: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTeacherTeacher extends Struct.CollectionTypeSchema {
  collectionName: 'teachers';
  info: {
    displayName: 'Teacher';
    pluralName: 'teachers';
    singularName: 'teacher';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    course_modules: Schema.Attribute.Relation<
      'oneToMany',
      'api::course-module.course-module'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::teacher.teacher'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    recorderd_lectures: Schema.Attribute.Relation<
      'oneToMany',
      'api::recorderd-lecture.recorderd-lecture'
    >;
    teacher_desc: Schema.Attribute.Text & Schema.Attribute.Required;
    teacher_image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    > &
      Schema.Attribute.Required;
    teacher_name: Schema.Attribute.String & Schema.Attribute.Required;
    teacher_rating: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 0;
        },
        number
      >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTransactionHistoryTransactionHistory
  extends Struct.CollectionTypeSchema {
  collectionName: 'transaction_histories';
  info: {
    displayName: 'Transaction History';
    pluralName: 'transaction-histories';
    singularName: 'transaction-history';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    amount: Schema.Attribute.Decimal;
    commission: Schema.Attribute.Relation<
      'oneToOne',
      'api::commission.commission'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    direction: Schema.Attribute.Enumeration<['CREDIT', 'DEBIT']>;
    earner: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::transaction-history.transaction-history'
    > &
      Schema.Attribute.Private;
    payout: Schema.Attribute.Relation<'oneToOne', 'api::payout.payout'>;
    publishedAt: Schema.Attribute.DateTime;
    reference: Schema.Attribute.String;
    regno: Schema.Attribute.String;
    remark: Schema.Attribute.String;
    source_user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    transaction_status: Schema.Attribute.Enumeration<
      ['SUCCESS', 'FAILED', 'PENDING']
    >;
    transdate: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['COMMISSION', 'WITHDRAW', 'DEDUCT']>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    wallet: Schema.Attribute.Relation<'manyToOne', 'api::wallet.wallet'>;
  };
}

export interface ApiUpgradeRequestsUpgradeRequest
  extends Struct.CollectionTypeSchema {
  collectionName: 'upgrade_requests';
  info: {
    displayName: 'Upgrade Requests';
    pluralName: 'upgrade-requests';
    singularName: 'upgrade-request';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    account_holder_name: Schema.Attribute.String;
    amount: Schema.Attribute.Decimal;
    bank_name: Schema.Attribute.String;
    card_type: Schema.Attribute.String;
    category_id: Schema.Attribute.Integer;
    cheque_no: Schema.Attribute.String;
    city: Schema.Attribute.String;
    comment: Schema.Attribute.Text;
    company_account: Schema.Attribute.String;
    company_bank: Schema.Attribute.String;
    confirm_date: Schema.Attribute.DateTime;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deposit_at: Schema.Attribute.String;
    from_account: Schema.Attribute.String;
    invoice_no: Schema.Attribute.String;
    issue_by: Schema.Attribute.String;
    kit_id: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::upgrade-requests.upgrade-request'
    > &
      Schema.Attribute.Private;
    no_of_epin: Schema.Attribute.Integer;
    order_id: Schema.Attribute.String;
    pay_amount: Schema.Attribute.Decimal;
    pay_date: Schema.Attribute.Date;
    pay_mode: Schema.Attribute.String;
    payment_type: Schema.Attribute.String;
    person_name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    razorpay_order_id: Schema.Attribute.String;
    razorpay_payment_id: Schema.Attribute.String;
    razorpay_signature: Schema.Attribute.String;
    receipt_upload: Schema.Attribute.String;
    ref_date: Schema.Attribute.Date;
    ref_no: Schema.Attribute.String;
    ref_regno: Schema.Attribute.String;
    regno: Schema.Attribute.String;
    req_code: Schema.Attribute.String;
    req_date: Schema.Attribute.DateTime;
    req_status: Schema.Attribute.String;
    request_type: Schema.Attribute.String;
    seen: Schema.Attribute.Boolean;
    swiped_by: Schema.Attribute.String;
    transaction_no: Schema.Attribute.String;
    transaction_ref_no: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    upgrade_req_old_id: Schema.Attribute.Integer;
  };
}

export interface ApiUserBonusStatusUserBonusStatus
  extends Struct.CollectionTypeSchema {
  collectionName: 'user_bonus_statuses';
  info: {
    displayName: 'Level Income Window';
    pluralName: 'user-bonus-statuses';
    singularName: 'user-bonus-status';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    activatedAt: Schema.Attribute.DateTime;
    bonusRule: Schema.Attribute.Relation<
      'manyToOne',
      'api::bonus-rule.bonus-rule'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    isActive: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::user-bonus-status.user-bonus-status'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiUserClubStatusUserClubStatus
  extends Struct.CollectionTypeSchema {
  collectionName: 'user_club_statuses';
  info: {
    displayName: 'Club Income Window';
    pluralName: 'user-club-statuses';
    singularName: 'user-club-status';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    activatedAt: Schema.Attribute.DateTime;
    club: Schema.Attribute.Relation<'manyToOne', 'api::club.club'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    expiresAt: Schema.Attribute.DateTime;
    isActive: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::user-club-status.user-club-status'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    washedOutAt: Schema.Attribute.DateTime;
  };
}

export interface ApiUserSessionUserSession extends Struct.CollectionTypeSchema {
  collectionName: 'user_sessions';
  info: {
    displayName: 'User Session';
    pluralName: 'user-sessions';
    singularName: 'user-session';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    device_id: Schema.Attribute.String;
    device_info: Schema.Attribute.String;
    expires_at: Schema.Attribute.DateTime;
    ip_address: Schema.Attribute.Text;
    is_active: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::user-session.user-session'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Text & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.String & Schema.Attribute.Required;
    users: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
  };
}

export interface ApiVideoProgressVideoProgress
  extends Struct.CollectionTypeSchema {
  collectionName: 'video_progresses';
  info: {
    displayName: 'Video Progress';
    pluralName: 'video-progresses';
    singularName: 'video-progress';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    current_time: Schema.Attribute.Decimal;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::video-progress.video-progress'
    > &
      Schema.Attribute.Private;
    module: Schema.Attribute.Relation<
      'manyToOne',
      'api::course-module.course-module'
    >;
    module_id: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    purchased_course: Schema.Attribute.Relation<
      'manyToOne',
      'api::purchased-course.purchased-course'
    >;
    recorderd_lecture: Schema.Attribute.Relation<
      'oneToOne',
      'api::recorderd-lecture.recorderd-lecture'
    >;
    total_covered: Schema.Attribute.Decimal;
    total_played: Schema.Attribute.Decimal;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    video_id: Schema.Attribute.String;
  };
}

export interface ApiWalletWallet extends Struct.CollectionTypeSchema {
  collectionName: 'wallets';
  info: {
    displayName: 'Wallet';
    pluralName: 'wallets';
    singularName: 'wallet';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    Affiliate_Income: Schema.Attribute.Decimal;
    Club_Income: Schema.Attribute.Decimal;
    commissions: Schema.Attribute.Relation<
      'oneToMany',
      'api::commission.commission'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    last_transaction_at: Schema.Attribute.DateTime;
    Level_Income: Schema.Attribute.Decimal;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::wallet.wallet'
    > &
      Schema.Attribute.Private;
    locked_amount: Schema.Attribute.Decimal;
    payouts: Schema.Attribute.Relation<'oneToMany', 'api::payout.payout'>;
    publishedAt: Schema.Attribute.DateTime;
    regno: Schema.Attribute.String;
    total_balance: Schema.Attribute.Decimal;
    total_earned: Schema.Attribute.Decimal;
    total_withdrawn: Schema.Attribute.Decimal;
    transaction_histories: Schema.Attribute.Relation<
      'oneToMany',
      'api::transaction-history.transaction-history'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    wallet_status: Schema.Attribute.Enumeration<['ACTIVE', 'BLOCKED']>;
    wrong_income: Schema.Attribute.Decimal;
  };
}

export interface ApiWebinarWebinar extends Struct.CollectionTypeSchema {
  collectionName: 'webinars';
  info: {
    displayName: 'Webinar';
    pluralName: 'webinars';
    singularName: 'webinar';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    course_categories: Schema.Attribute.Relation<
      'manyToMany',
      'api::course-category.course-category'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    duration: Schema.Attribute.Decimal;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::webinar.webinar'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    start_time: Schema.Attribute.DateTime;
    title: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<
      ['webinar', 'meeting', 'ADVANCED_WEBINAR']
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    url: Schema.Attribute.String;
    webinar_by: Schema.Attribute.Relation<'manyToOne', 'api::mentor.mentor'>;
  };
}

export interface PluginContentReleasesRelease
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    releasedAt: Schema.Attribute.DateTime;
    scheduledAt: Schema.Attribute.DateTime;
    status: Schema.Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Schema.Attribute.Required;
    timezone: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    entryDocumentId: Schema.Attribute.String;
    isEntryValid: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    release: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Schema.Attribute.Enumeration<['publish', 'unpublish']> &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginI18NLocale extends Struct.CollectionTypeSchema {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String & Schema.Attribute.Unique;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::i18n.locale'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflow
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows';
  info: {
    description: '';
    displayName: 'Workflow';
    name: 'Workflow';
    pluralName: 'workflows';
    singularName: 'workflow';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentTypes: Schema.Attribute.JSON &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'[]'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    stageRequiredToPublish: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::review-workflows.workflow-stage'
    >;
    stages: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflowStage
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows_stages';
  info: {
    description: '';
    displayName: 'Stages';
    name: 'Workflow Stage';
    pluralName: 'workflow-stages';
    singularName: 'workflow-stage';
  };
  options: {
    draftAndPublish: false;
    version: '1.1.0';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#4945FF'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    permissions: Schema.Attribute.Relation<'manyToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    workflow: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::review-workflows.workflow'
    >;
  };
}

export interface PluginUploadFile extends Struct.CollectionTypeSchema {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Schema.Attribute.String;
    caption: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ext: Schema.Attribute.String;
    folder: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'> &
      Schema.Attribute.Private;
    folderPath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    formats: Schema.Attribute.JSON;
    hash: Schema.Attribute.String & Schema.Attribute.Required;
    height: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.file'
    > &
      Schema.Attribute.Private;
    mime: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    previewUrl: Schema.Attribute.String;
    provider: Schema.Attribute.String & Schema.Attribute.Required;
    provider_metadata: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    related: Schema.Attribute.Relation<'morphToMany'>;
    size: Schema.Attribute.Decimal & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    width: Schema.Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Struct.CollectionTypeSchema {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.folder'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    files: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.file'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.folder'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    parent: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'>;
    path: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    pathId: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.role'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.String & Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'users-permissions': {
      usernameRequired: false;
    };
  };
  attributes: {
    active: Schema.Attribute.Boolean;
    address: Schema.Attribute.String;
    affiliate_expired: Schema.Attribute.Boolean;
    affiliate_expiredAt: Schema.Attribute.DateTime;
    affiliate_trees_child: Schema.Attribute.Relation<
      'oneToMany',
      'api::affiliate-tree.affiliate-tree'
    >;
    affiliate_trees_parent: Schema.Attribute.Relation<
      'oneToMany',
      'api::affiliate-tree.affiliate-tree'
    >;
    affiliateJoinedAt: Schema.Attribute.DateTime;
    agree: Schema.Attribute.Boolean;
    blocked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    childAffiliate: Schema.Attribute.Relation<
      'manyToOne',
      'api::referral-tree.referral-tree'
    >;
    club_250_expiredAt: Schema.Attribute.DateTime;
    club_250_isActive: Schema.Attribute.Boolean;
    club_50_expiredAt: Schema.Attribute.DateTime;
    club_50_isActive: Schema.Attribute.Boolean;
    club_500_expiredAt: Schema.Attribute.DateTime;
    club_500_isActive: Schema.Attribute.Boolean;
    commission_earner: Schema.Attribute.Relation<
      'oneToMany',
      'api::commission.commission'
    >;
    commission_source_user: Schema.Attribute.Relation<
      'oneToMany',
      'api::commission.commission'
    >;
    confirm_affiliate_payment: Schema.Attribute.Boolean;
    confirmationToken: Schema.Attribute.String & Schema.Attribute.Private;
    confirmed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    country: Schema.Attribute.Enumeration<
      [
        'Afghanistan',
        'Albania',
        'Algeria',
        'Andorra',
        'Angola',
        'Antigua and Barbuda',
        'Argentina',
        'Armenia',
        'Australia',
        'Austria',
        'Azerbaijan',
        'Bahamas',
        'Bahrain',
        'Bangladesh',
        'Barbados',
        'Belarus',
        'Belgium',
        'Belize',
        'Benin',
        'Bhutan',
        'Bolivia',
        'Bosnia and Herzegovina',
        'Botswana',
        'Brazil',
        'Brunei',
        'Bulgaria',
        'Burkina Faso',
        'Burundi',
        'Cabo Verde',
        'Cambodia',
        'Cameroon',
        'Canada',
        'Central African Republic',
        'Chad',
        'Chile',
        'China',
        'Colombia',
        'Comoros',
        'Congo (Congo-Brazzaville)',
        'Costa Rica',
        'Croatia',
        'Cuba',
        'Cyprus',
        'Czechia (Czech Republic)',
        'Democratic Republic of the Congo',
        'Denmark',
        'Djibouti',
        'Dominica',
        'Dominican Republic',
        'Ecuador',
        'Egypt',
        'El Salvador',
        'Equatorial Guinea',
        'Eritrea',
        'Estonia',
        'Eswatini (fmr. "Swaziland")',
        'Ethiopia',
        'Fiji',
        'Finland',
        'France',
        'Gabon',
        'Gambia',
        'Georgia',
        'Germany',
        'Ghana',
        'Greece',
        'Grenada',
        'Guatemala',
        'Guinea',
        'Guinea-Bissau',
        'Guyana',
        'Haiti',
        'Honduras',
        'Hungary',
        'Iceland',
        'India',
        'Indonesia',
        'Iran',
        'Iraq',
        'Ireland',
        'Israel',
        'Italy',
        'Jamaica',
        'Japan',
        'Jordan',
        'Kazakhstan',
        'Kenya',
        'Kiribati',
        'Kuwait',
        'Kyrgyzstan',
        'Laos',
        'Latvia',
        'Lebanon',
        'Lesotho',
        'Liberia',
        'Libya',
        'Liechtenstein',
        'Lithuania',
        'Luxembourg',
        'Madagascar',
        'Malawi',
        'Malaysia',
        'Maldives',
        'Mali',
        'Malta',
        'Marshall Islands',
        'Mauritania',
        'Mauritius',
        'Mexico',
        'Micronesia',
        'Moldova',
        'Monaco',
        'Mongolia',
        'Montenegro',
        'Morocco',
        'Mozambique',
        'Myanmar (Burma)',
        'Namibia',
        'Nauru',
        'Nepal',
        'Netherlands',
        'New Zealand',
        'Nicaragua',
        'Niger',
        'Nigeria',
        'North Korea',
        'North Macedonia (formerly Macedonia)',
        'Norway',
        'Oman',
        'Pakistan',
        'Palau',
        'Palestine',
        'Panama',
        'Papua New Guinea',
        'Paraguay',
        'Peru',
        'Philippines',
        'Poland',
        'Portugal',
        'Qatar',
        'Romania',
        'Russia',
        'Rwanda',
        'Saint Kitts and Nevis',
        'Saint Lucia',
        'Saint Vincent and the Grenadines',
        'Samoa',
        'San Marino',
        'Sao Tome and Principe',
        'Saudi Arabia',
        'Senegal',
        'Serbia',
        'Seychelles',
        'Sierra Leone',
        'Singapore',
        'Slovakia',
        'Slovenia',
        'Solomon Islands',
        'Somalia',
        'South Africa',
        'South Korea',
        'South Sudan',
        'Spain',
        'Sri Lanka',
        'Sudan',
        'Suriname',
        'Sweden',
        'Switzerland',
        'Syria',
        'Tajikistan',
        'Tanzania',
        'Thailand',
        'Timor-Leste',
        'Togo',
        'Tonga',
        'Trinidad and Tobago',
        'Tunisia',
        'Turkey',
        'Turkmenistan',
        'Tuvalu',
        'Uganda',
        'Ukraine',
        'United Arab Emirates',
        'United Kingdom',
        'United States of America',
        'Uruguay',
        'Uzbekistan',
        'Vanuatu',
        'Vatican City (Holy See)',
        'Venezuela',
        'Vietnam',
        'Yemen',
        'Zambia',
        'Zimbabwe',
      ]
    >;
    course_modules: Schema.Attribute.Relation<
      'oneToMany',
      'api::course-module.course-module'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    directReferralCount: Schema.Attribute.Integer;
    dob: Schema.Attribute.Date & Schema.Attribute.DefaultTo<'2025-09-18'>;
    doc_date: Schema.Attribute.Date;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    epassword: Schema.Attribute.String & Schema.Attribute.Private;
    father_husband_name: Schema.Attribute.String;
    first_password: Schema.Attribute.String & Schema.Attribute.Private;
    firstName: Schema.Attribute.String;
    fullName: Schema.Attribute.String;
    gender: Schema.Attribute.Enumeration<['male', 'female', 'other']>;
    hasPurchasedCourse: Schema.Attribute.Boolean;
    introregno: Schema.Attribute.Integer;
    is_online: Schema.Attribute.Boolean;
    kyc_documents: Schema.Attribute.Relation<
      'oneToMany',
      'api::kyc-document.kyc-document'
    >;
    last_seen: Schema.Attribute.DateTime;
    lastlogin: Schema.Attribute.DateTime;
    lastName: Schema.Attribute.String;
    level_10_commission_window_expired: Schema.Attribute.Boolean;
    level_10_commission_window_expiredAt: Schema.Attribute.DateTime;
    level_5_commission_window_expired: Schema.Attribute.Boolean;
    level_5_commission_window_expiredAt: Schema.Attribute.DateTime;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    > &
      Schema.Attribute.Private;
    loginedit: Schema.Attribute.Boolean;
    loginid: Schema.Attribute.String;
    member_accounts: Schema.Attribute.Relation<
      'oneToMany',
      'api::member-accounts.member-account'
    >;
    member_master: Schema.Attribute.Relation<
      'oneToOne',
      'api::member-masters.member-master'
    >;
    memcode: Schema.Attribute.String;
    mentor_description: Schema.Attribute.Text;
    mentor_expertise: Schema.Attribute.String;
    mobileNumber: Schema.Attribute.BigInteger;
    mssql_password: Schema.Attribute.String & Schema.Attribute.Private;
    nominee_dob: Schema.Attribute.Date;
    nominee_name: Schema.Attribute.String;
    nominee_relation: Schema.Attribute.String;
    ownReferralCode: Schema.Attribute.String;
    parentAffiliate: Schema.Attribute.Relation<
      'oneToMany',
      'api::referral-tree.referral-tree'
    >;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    payments: Schema.Attribute.Relation<'oneToMany', 'api::payment.payment'>;
    payouts: Schema.Attribute.Relation<'oneToMany', 'api::payout.payout'>;
    pincode: Schema.Attribute.String;
    profile_image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    profile_img_path: Schema.Attribute.String;
    provider: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    purchased_courses: Schema.Attribute.Relation<
      'oneToMany',
      'api::purchased-course.purchased-course'
    >;
    quiz: Schema.Attribute.Relation<'manyToOne', 'api::quiz.quiz'>;
    quiz_scores: Schema.Attribute.Relation<
      'oneToMany',
      'api::quiz-score.quiz-score'
    >;
    randomid: Schema.Attribute.String;
    recorderd_lectures: Schema.Attribute.Relation<
      'oneToMany',
      'api::recorderd-lecture.recorderd-lecture'
    >;
    referralByCode: Schema.Attribute.String;
    referralName: Schema.Attribute.String;
    referrals: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    referredBy: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    refunds: Schema.Attribute.Relation<'oneToMany', 'api::refund.refund'>;
    regno: Schema.Attribute.String;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    rlevel: Schema.Attribute.Integer;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    secret_ans: Schema.Attribute.String & Schema.Attribute.Private;
    secret_qid: Schema.Attribute.Integer & Schema.Attribute.Private;
    sponsar_ID: Schema.Attribute.String;
    student_libraries: Schema.Attribute.Relation<
      'oneToMany',
      'api::student-library.student-library'
    >;
    terms: Schema.Attribute.Boolean;
    totalReferralCount: Schema.Attribute.Integer;
    transaction_earner: Schema.Attribute.Relation<
      'oneToMany',
      'api::transaction-history.transaction-history'
    >;
    transaction_source_user: Schema.Attribute.Relation<
      'oneToMany',
      'api::transaction-history.transaction-history'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user_bonus_status: Schema.Attribute.Relation<
      'oneToMany',
      'api::user-bonus-status.user-bonus-status'
    >;
    user_club_status: Schema.Attribute.Relation<
      'oneToMany',
      'api::user-club-status.user-club-status'
    >;
    username: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    video_progresses: Schema.Attribute.Relation<
      'oneToMany',
      'api::video-progress.video-progress'
    >;
    wallet: Schema.Attribute.Relation<'oneToOne', 'api::wallet.wallet'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ContentTypeSchemas {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::affiliate-dashboard.affiliate-dashboard': ApiAffiliateDashboardAffiliateDashboard;
      'api::affiliate-tree.affiliate-tree': ApiAffiliateTreeAffiliateTree;
      'api::blog-category.blog-category': ApiBlogCategoryBlogCategory;
      'api::blog.blog': ApiBlogBlog;
      'api::bonus-rule.bonus-rule': ApiBonusRuleBonusRule;
      'api::club-250-members.club-250-member': ApiClub250MembersClub250Member;
      'api::club-50-members.club-50-member': ApiClub50MembersClub50Member;
      'api::club-500-members.club-500-member': ApiClub500MembersClub500Member;
      'api::club.club': ApiClubClub;
      'api::commission-level.commission-level': ApiCommissionLevelCommissionLevel;
      'api::commission.commission': ApiCommissionCommission;
      'api::contact-enquiry.contact-enquiry': ApiContactEnquiryContactEnquiry;
      'api::course-category.course-category': ApiCourseCategoryCourseCategory;
      'api::course-module.course-module': ApiCourseModuleCourseModule;
      'api::course-playlist.course-playlist': ApiCoursePlaylistCoursePlaylist;
      'api::faq.faq': ApiFaqFaq;
      'api::kyc-document.kyc-document': ApiKycDocumentKycDocument;
      'api::member-accounts.member-account': ApiMemberAccountsMemberAccount;
      'api::member-level-binaries.member-level-binary': ApiMemberLevelBinariesMemberLevelBinary;
      'api::member-level-join-detail-binaries.member-level-join-detail-binary': ApiMemberLevelJoinDetailBinariesMemberLevelJoinDetailBinary;
      'api::member-level-join-details.member-level-join-detail': ApiMemberLevelJoinDetailsMemberLevelJoinDetail;
      'api::member-levels.member-level': ApiMemberLevelsMemberLevel;
      'api::member-logins.member-login': ApiMemberLoginsMemberLogin;
      'api::member-masters.member-master': ApiMemberMastersMemberMaster;
      'api::member-payment-details.member-payment-detail': ApiMemberPaymentDetailsMemberPaymentDetail;
      'api::member-payout-details.member-payout-detail': ApiMemberPayoutDetailsMemberPayoutDetail;
      'api::member-payouts.member-payout': ApiMemberPayoutsMemberPayout;
      'api::member-settlement-accounts.member-settlement-account': ApiMemberSettlementAccountsMemberSettlementAccount;
      'api::mentor.mentor': ApiMentorMentor;
      'api::message.message': ApiMessageMessage;
      'api::notifications.notification': ApiNotificationsNotification;
      'api::payment.payment': ApiPaymentPayment;
      'api::payout.payout': ApiPayoutPayout;
      'api::product-order-details.product-order-detail': ApiProductOrderDetailsProductOrderDetail;
      'api::product-orders.product-order': ApiProductOrdersProductOrder;
      'api::purchased-course.purchased-course': ApiPurchasedCoursePurchasedCourse;
      'api::quiz-score.quiz-score': ApiQuizScoreQuizScore;
      'api::quiz.quiz': ApiQuizQuiz;
      'api::recorderd-lecture.recorderd-lecture': ApiRecorderdLectureRecorderdLecture;
      'api::referral-tree.referral-tree': ApiReferralTreeReferralTree;
      'api::refund.refund': ApiRefundRefund;
      'api::student-dashboard.student-dashboard': ApiStudentDashboardStudentDashboard;
      'api::student-library.student-library': ApiStudentLibraryStudentLibrary;
      'api::tbl-binary-volumes.tbl-binary-volume': ApiTblBinaryVolumesTblBinaryVolume;
      'api::tbl-kyc-completes.tbl-kyc-complete': ApiTblKycCompletesTblKycComplete;
      'api::tbl-kyc-documents.tbl-kyc-document': ApiTblKycDocumentsTblKycDocument;
      'api::tbl-kyc-status-members.tbl-kyc-status-member': ApiTblKycStatusMembersTblKycStatusMember;
      'api::tbl-sponsor-logs.tbl-sponsor-log': ApiTblSponsorLogsTblSponsorLog;
      'api::teacher.teacher': ApiTeacherTeacher;
      'api::transaction-history.transaction-history': ApiTransactionHistoryTransactionHistory;
      'api::upgrade-requests.upgrade-request': ApiUpgradeRequestsUpgradeRequest;
      'api::user-bonus-status.user-bonus-status': ApiUserBonusStatusUserBonusStatus;
      'api::user-club-status.user-club-status': ApiUserClubStatusUserClubStatus;
      'api::user-session.user-session': ApiUserSessionUserSession;
      'api::video-progress.video-progress': ApiVideoProgressVideoProgress;
      'api::wallet.wallet': ApiWalletWallet;
      'api::webinar.webinar': ApiWebinarWebinar;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::review-workflows.workflow': PluginReviewWorkflowsWorkflow;
      'plugin::review-workflows.workflow-stage': PluginReviewWorkflowsWorkflowStage;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
