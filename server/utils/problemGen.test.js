const expect = require('expect');

const {problemGen} = require('./problemGen');


describe('problemGen', () => {
    it('should generate a Problem', () => {
        var roomName = "Room";

        var problem = problemGen(roomName);
        expect(problem.room).toBe(roomName);
        expect(problem.problem).toNotBe(typeof undefined);
        expect(problem.isCorrect).toNotBe(typeof undefined);
        expect(problem.completed).toBe(false);
    });
});