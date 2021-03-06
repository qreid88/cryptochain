const Blockchain = require('./blockchain');
const Block = require('./block');

describe('blockchain', () => {
    let blockchain, newChain, originalChain;

    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();

        originalChain = blockchain.chain;
    });

    it('contains a `chain` Array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('starts with the genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block to the chain', () => {
        const newData = 'foo bar';
        blockchain.addBlock({ data: newData });

        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
    });

    describe('isValidChain()', () => {
        describe('when the chain does not start with the genesis block', () => {
            it(' returns false', () => {
                blockchain.chain[0] = { data: 'fake-genesis' };

                expect(blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe('when the chain starts with the genesis block and has multiple blocks', () => {
            beforeEach(() => {
                blockchain.addBlock({ data: 'Bears'})
                blockchain.addBlock({ data: 'Beets'})
                blockchain.addBlock({ data: 'Battlestar Galactica'});
            });

            describe(' and a lastHash reference has changed', () => {
                it('returns false', () => {
                    blockchain.chain[2].lastHash = 'broken-lastHash';

                expect(blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe(' and the chain contains a block with an invalid field', () => {
                it('returns false', () => {

                    blockchain.chain[2].lastHash = 'bad-and-evil-data';

                    expect(blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe(' and the chain does not contain any invalid blocks', () => {
                it('returns true', () => {
                    expect(blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });

    describe( 'replaceChain()', () => {
        describe('when the new chain is not longer', () => {
            it('does not replace the chain', () => {
                blockchain.replaceChain(newChain.chain);
            });
        });

        describe(' when the chain is longer', () => {
            beforeEach(() => {
                blockchain.addBlock({ data: 'Bears'})
                blockchain.addBlock({ data: 'Beets'})
                blockchain.addBlock({ data: 'Battlestar Galactica'});
            });

            describe('and the chain is invalid', () => {
             it('does not replace the chain', () => {
                newChain.chain[2] = 'some-fake-hash';

                blockchain.replaceChain(newChain.chain);

                expect(blockchain.chain).toEqual(originalChain);
                });
            });
            describe('and the chain is valid', () => {
                it(' replaces the chain', () => {
                    blockchain.replaceChain(newChain.chain);

                    expect(blockchain.chain).toEqual(newChain.chain);
                });
            });
        });
    });
});
