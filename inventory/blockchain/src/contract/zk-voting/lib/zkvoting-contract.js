/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const Election = require('./election');
const MyVote = require('./myvote');
const Admins = require('./admins');

const seeds = require('./seeds.json');
const sha512 = require('js-sha512');

const Helper = require('./helper');


class ZKVotingContract extends Contract {

    async init(ctx) {
        console.info('ZKVoting Contract Initialized');
    }

    async doNothing(ctx) {
        console.info("DoNothing Transaction Invoked");
    }

    async initLedger(ctx) {
        console.info("InitLedger Transaction Invoked");

        // save admins
        for (const adm of seeds.admins) {
            let hashedKey = sha512(adm.key);
            let objAdmin = new Admins(adm.id, hashedKey);
            await ctx.stub.putState(adm.id, Buffer.from(JSON.stringify(objAdmin)));
        }

        // save elections
        for (const e of seeds.initElections) {

            let obj = new Election(e.id, e.candidates);
            await ctx.stub.putState(e.id, Buffer.from(JSON.stringify(obj)));
        }

    }

    async configureElection(ctx, electionId, candidates, adminId, adminKey) {

        Helper.throwErrorIfStringIsEmpty(electionId);
        Helper.throwErrorIfStringIsEmpty(candidates);
        Helper.throwErrorIfStringIsEmpty(adminId);
        Helper.throwErrorIfStringIsEmpty(adminKey);

        // check electionId
        let foundAsBytes = await ctx.stub.getState(electionId);
        if (Helper.objExists(foundAsBytes)) {
            throw new Error(`Election ${electionId} already exist`);
        }

        // check admin
        let adminAsBytes = await ctx.stub.getState(adminId);
        if (!Helper.objExists(adminAsBytes)) {
            throw new Error(`Admin ${adminId} doesnt exist`);
        }

        let adminjson = {};
        try {
            adminjson = JSON.parse(adminAsBytes.toString());
        } catch (err) {
            throw new Error(`Failed to parse Admin ${adminId}, err: ${err}`);
        }
        let admin = Admins.fromJSON(adminjson);

        let hashedKey = sha512(adminKey);
        if (hashedKey !== admin.hashedKey) {
            console.log(`Invalid admin key for admin ${adminId}`);
            return;
        }

        let candidatesList = JSON.parse(candidates);

        let election = new Election(electionId, candidatesList);
        await ctx.stub.putState(electionId, Buffer.from(JSON.stringify(election)));
    }

    async closeElection(ctx, electionId, adminId, adminKey) {

        Helper.throwErrorIfStringIsEmpty(electionId);
        Helper.throwErrorIfStringIsEmpty(adminId);
        Helper.throwErrorIfStringIsEmpty(adminKey);

        // check admin
        let adminAsBytes = await ctx.stub.getState(adminId);
        if (!Helper.objExists(adminAsBytes)) {
            throw new Error(`Admin ${adminId} doesnt exist`);
        }

        let adminjson = {};
        try {
            adminjson = JSON.parse(adminAsBytes.toString());
        } catch (err) {
            throw new Error(`Failed to parse Admin ${adminId}, err: ${err}`);
        }
        let admin = Admins.fromJSON(adminjson);

        let hashedKey = sha512(adminKey);
        if (hashedKey !== admin.hashedKey) {
            console.log(`Invalid admin key for admin ${adminId}`);
            return;
        }

        // check electionId
        let electionAsBytes = await ctx.stub.getState(electionId);
        if (!Helper.objExists(electionAsBytes)) {
            throw new Error(`Election ${electionId} doesnt exist`);
        }

        let electionjson = {};
        try {
            electionjson = JSON.parse(electionAsBytes.toString());
        } catch (err) {
            throw new Error(`Failed to parse Election ${electionjson}, err: ${err}`);
        }
        let election = Election.fromJSON(electionjson);

        if(election.isClosed){
            console.log("Election already closed");
            return;
        }

        election.close();
        await ctx.stub.putState(electionId, Buffer.from(JSON.stringify(election)));
    }

    async getCandidates(ctx, electionId) {

        Helper.throwErrorIfStringIsEmpty(electionId);

        // check electionId
        let electionAsBytes = await ctx.stub.getState(electionId);
        if (!Helper.objExists(electionAsBytes)) {
            throw new Error(`Election ${electionId} doesnt exist`);
        }

        let electionjson = {};
        try {
            electionjson = JSON.parse(electionAsBytes.toString());
        } catch (err) {
            throw new Error(`Failed to parse Election ${electionjson}, err: ${err}`);
        }
        let election = Election.fromJSON(electionjson);

        let result = {
            election_id: electionId,
            candidates: election.getCandidates()
        };
        return JSON.stringify(result);

    }

    async vote(ctx, electionId, voterId, candidat) {

        Helper.throwErrorIfStringIsEmpty(electionId);
        Helper.throwErrorIfStringIsEmpty(voterId);
        Helper.throwErrorIfStringIsEmpty(candidat);

        // check electionId
        let electionAsBytes = await ctx.stub.getState(electionId);
        if (!Helper.objExists(electionAsBytes)) {
            throw new Error(`Election ${electionId} doesnt exist`);
        }

        let electionjson = {};
        try {
            electionjson = JSON.parse(electionAsBytes.toString());
        } catch (err) {
            throw new Error(`Failed to parse Election ${electionjson}, err: ${err}`);
        }
        let election = Election.fromJSON(electionjson);

        if(election.isClosed){
            console.log("Voting Closed");
            return;
        }

        let voteInd = election.candidates.findIndex(c => c === candidat);
        if(voteInd === -1 ){
            throw new Error("Unsupported voting - candidat error");
        }

        let myvote = new MyVote(electionId, voterId, voteInd);
        election.storeVote(myvote);

        await ctx.stub.putState(electionId, Buffer.from(JSON.stringify(election)));
    }

    async getResults(ctx, electionId) {

        Helper.throwErrorIfStringIsEmpty(electionId);

        // check electionId
        let electionAsBytes = await ctx.stub.getState(electionId);
        if (!Helper.objExists(electionAsBytes)) {
            throw new Error(`Election ${electionId} doesnt exist`);
        }

        let electionjson = {};
        try {
            electionjson = JSON.parse(electionAsBytes.toString());
        } catch (err) {
            throw new Error(`Failed to parse Election ${electionjson}, err: ${err}`);
        }
        let election = Election.fromJSON(electionjson);

        let result = {
            election_id: electionId,
            results: election.getResults()
        };
        return JSON.stringify(result);

    }

    async hasVoted(ctx, electionId, voterId) {

        Helper.throwErrorIfStringIsEmpty(electionId);
        Helper.throwErrorIfStringIsEmpty(voterId);

        // check electionId
        let electionAsBytes = await ctx.stub.getState(electionId);
        if (!Helper.objExists(electionAsBytes)) {
            throw new Error(`Election ${electionId} doesnt exist`);
        }

        let electionjson = {};
        try {
            electionjson = JSON.parse(electionAsBytes.toString());
        } catch (err) {
            throw new Error(`Failed to parse Election ${electionjson}, err: ${err}`);
        }
        let election = Election.fromJSON(electionjson);

        let result = {
            election_id: electionId,
            voted: election.hasVoted(voterId)
        };
        return JSON.stringify(result);

    }

    async voteOK(ctx, electionId, voterId) {

        Helper.throwErrorIfStringIsEmpty(electionId);
        Helper.throwErrorIfStringIsEmpty(voterId);

        // check electionId
        let electionAsBytes = await ctx.stub.getState(electionId);
        if (!Helper.objExists(electionAsBytes)) {
            throw new Error(`Election ${electionId} doesnt exist`);
        }

        let electionjson = {};
        try {
            electionjson = JSON.parse(electionAsBytes.toString());
        } catch (err) {
            throw new Error(`Failed to parse Election ${electionjson}, err: ${err}`);
        }
        let election = Election.fromJSON(electionjson);

        let result = {
            election_id: electionId,
            voted: election.voteOK(voterId)
        };
        return JSON.stringify(result);
    }
}

module.exports = ZKVotingContract
