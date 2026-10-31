import type { Schema, Struct } from '@strapi/strapi';

export interface AllFaqsFaqComponent extends Struct.ComponentSchema {
  collectionName: 'components_all_faqs_faq_components';
  info: {
    displayName: 'Faq Component';
  };
  attributes: {
    answer: Schema.Attribute.Blocks;
    question: Schema.Attribute.Text;
  };
}

export interface AllLevelsAllLevelsComponent extends Struct.ComponentSchema {
  collectionName: 'components_all_levels_all_levels_components';
  info: {
    displayName: 'All Levels Component';
  };
  attributes: {
    level_1: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<3500>;
    level_10: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<1000>;
    level_2: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<2500>;
    level_3: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<1500>;
    level_4: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<1000>;
    level_5: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<750>;
    level_6: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<750>;
    level_7: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<500>;
    level_8: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<500>;
    level_9: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<500>;
  };
}

export interface AllLevelsLevel extends Struct.ComponentSchema {
  collectionName: 'components_all_levels_levels';
  info: {
    displayName: 'Level';
  };
  attributes: {};
}

export interface AllLevelsLevelc extends Struct.ComponentSchema {
  collectionName: 'components_all_levels_levelcs';
  info: {
    displayName: 'levelc';
  };
  attributes: {
    leve: Schema.Attribute.Component<'all-levels.all-levels-component', true>;
  };
}

export interface McqQuiz extends Struct.ComponentSchema {
  collectionName: 'components_mcq_quizzes';
  info: {
    displayName: 'Quiz';
  };
  attributes: {
    correct_answer: Schema.Attribute.Enumeration<
      ['option_1', 'option_2', 'option_3', 'option_4']
    > &
      Schema.Attribute.Required;
    option_1: Schema.Attribute.String & Schema.Attribute.Required;
    option_2: Schema.Attribute.String & Schema.Attribute.Required;
    option_3: Schema.Attribute.String & Schema.Attribute.Required;
    option_4: Schema.Attribute.String & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'all-faqs.faq-component': AllFaqsFaqComponent;
      'all-levels.all-levels-component': AllLevelsAllLevelsComponent;
      'all-levels.level': AllLevelsLevel;
      'all-levels.levelc': AllLevelsLevelc;
      'mcq.quiz': McqQuiz;
    }
  }
}
