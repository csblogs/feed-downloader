import Sequelize from 'sequelize';
import database from '../';
import User from './user';

const URI = Sequelize.STRING(2048);

const blogPostDatabaseDefinition = database.define('blog_post', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'id',
    allowNull: false
  },
  title: {
    type: Sequelize.STRING,
    field: 'title',
    allowNull: false
  },
  link: {
    type: URI,
    field: 'link',
    allowNull: false
  },
  imageURI: {
    type: URI,
    field: 'image_uri',
    allowNull: true
  },
  description: {
    type: Sequelize.TEXT,
    field: 'description',
    allowNull: false
  },
  dateUpdated: {
    type: Sequelize.DATE,
    field: 'date_updated',
    allowNull: false
  },
  datePublished: {
    type: Sequelize.DATE,
    field: 'date_published',
    allowNull: false
  }
}, {
  underscored: true
});

blogPostDatabaseDefinition.belongsTo(User, { as: 'author', foreignKey: { name: 'author_id', allowNull: false } });

export default blogPostDatabaseDefinition;

