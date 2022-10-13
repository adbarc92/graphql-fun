const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLList } = require('graphql');

const monsters = require('./data/monsters.json');
const skills = require('./data/skills.json');

const PORT = 4000;

const MonsterType = new GraphQLObjectType({
  name: 'Monster',
  description: 'This represents a monster',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLNonNull(GraphQLString) },
    family: { type: GraphQLNonNull(GraphQLString) },
  })
})

const SkillType = new GraphQLObjectType({
  name: 'Skill',
  description: 'A skill for use by a unit or monster',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLNonNull(GraphQLString) },
    type: { type: GraphQLNonNull(GraphQLString) },
  })
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    monster: {
      type: MonsterType,
      description: 'A monster',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => monsters.find(monster => monster.id === args.id)
    },
    monsters: {
      type: new GraphQLList(MonsterType),
      resolve: () => monsters
    },
    skill: {
      type: SkillType,
      description: 'A skill',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => skills.find(skill => skill.id === args.id)
    },
    skills: {
      type: new GraphQLList(SkillType),
      resolve: () => skills
    }
  })
})

const schema = GraphQLSchema({
  query: RootQueryType,
  // mutation: RootMutationType,
});

const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}))

app.listen(PORT, () => console.log(`Running a GraphQL API server at http://localhost:${PORT}/graphql`));
