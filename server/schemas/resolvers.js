const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const {signToken} = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            try {
                if (context.user) {
                    const userId = context.user._id;
                    const user = await User.findById({ _id: userId })
                        .populate({
                            path: 'savedBooks'
                        });
                    return user;
                }
            } catch (err) {
                console.log(err);
            }
        }
    },

    Mutation: {
        createUser: async (parent, args) => {
            try {
                const user = await User.create(args);
                const token = signToken(user);
                if (!user) {
                    return res.status(400).json({ message: 'Something is wrong!' });
                }

                return { token, user };
            } catch (err) {
                console.log(err)
            }
        },

        login: async (parent, { email, password }) => {
            try {
                const user = await User.findOne({email});

                if (!user) {
                    throw new AuthenticationError('No user found!');
                }

                const correctPass = await user.isCorrectPassword(password);

                if (!correctPass) {
                    throw new AuthenticationError('Not valid! Please try again.')
                }

                const token = signToken(user);
                return {token, user};
            } catch (err) {
                console.log(err)
            }
        },

        saveBook: async(parent, args, context) => {
            try {
                if (context.user) {
                    const userId = context.user._id;
                    // const userId = mongoose.Types.ObjectId(context.user._id);
                    
                    const user = await User.findOneAndUpdate(
                        {_id: userId},
                        {
                            $addToSet:{
                                savedBooks:  args 
                            }
                        },
                        { new: true }
                    )

                    return user;
                }
            } catch (err) {
                console.log(err)
            }
        },

        deleteBook: async (parent, args, context) => {
            try {
                if (context.user) {
                    const userId = context.user._id;
                    const bookId = args.bookId;

                    const updateUser = await User.findOneAndUpdate(
                        {_id: userId},
                        {$pull: { savedBooks: {bookId: bookId }}},
                        {new : true}
                    );
                    
                    return updateUser;
                    
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
}


module.exports = resolvers;