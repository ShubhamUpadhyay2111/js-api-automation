import { expect } from 'chai';
import supertest from 'supertest';
const request = new supertest('https://gorest.co.in/public/v2/');

const TOKEN = '501c98e7a4a28435cffe3289c8ae67b1bb53877a9c14bd2a36b7c9b91b3aa3dc';
describe('Users', () => {
    let userId;

    describe('POST', () => {
        it('POST /users', () => {
            const data = {
                email: `test-${Math.floor(Math.random() * 99999999999999)}@mail.com`,
                name: 'Test Test',
                gender: 'male',
                status: 'inactive'
            };

            return request.post('users')
                .set({ Authorization: `Bearer ${TOKEN}` })
                .send(data)
                .then((res) => {
                    expect(res.body).to.deep.include(data);
                    userId = res.body.id;
                })
        })
    });

    describe('GET', () => {
        it('/users', () => {
            return request.get(`users`)
                .set({ Authorization: `Bearer ${TOKEN}` })
                .then((res) => {
                    expect(res.body).to.not.be.empty;
                });
        });

        it('/users/:id', () => {
            return request.get(`users/${userId}`)
                .set({ Authorization: `Bearer ${TOKEN}` })
                .then((res) => {
                    expect(res.body.id).to.be.eq(userId);
                });
        });


        it('/users with query params', () => {
            const url = `users?page=5&gender=female&status=inactive`;

            return request.get(url)
                .set({ Authorization: `Bearer ${TOKEN}` })
                .then((res) => {
                    expect(res.body).to.not.be.empty;
                    res.body.forEach(data => {
                        expect(data.gender).to.eq('female');
                        expect(data.status).to.eq('inactive');
                    })
                });
        });
    });

    describe('PUT', () => {
        it('PUT /users', () => {
            const data = {
                status: 'active'
            };

            return request.put(`users/${userId}`)
                .set({ Authorization: `Bearer ${TOKEN}` })
                .send(data)
                .then((res) => {
                    expect(res.body).to.deep.include(data);
                })
        });
    });

    describe('DELETE', () => {
        it('/users', () => {
            const data = {
                status: 'active'
            };

            return request
                .delete(`users/${userId}`)
                .set({ Authorization: `Bearer ${TOKEN}` })
                .then((res) => {
                    expect(res.body).to.be.empty;
                })
        });
    });
})