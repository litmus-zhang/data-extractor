import { describe, it, beforeAll, afterAll } from "bun:test";
import { faker } from "@faker-js/faker"
import * as pactum from 'pactum';
import { clearDb } from "../../src/db/index.ts";
import { App, app } from "../../src/server.ts";


let server: App
let baseURL: string

describe("Data Extractor e2e test", () => {
    beforeAll(async () => {
        server = app.listen(0)
        baseURL = `http://localhost:${server.server?.port}`
        pactum.request.setBaseUrl(baseURL)

    });
    afterAll(async () => {
        await clearDb()
        await server.stop()

    });
    describe("General Healthcheck", () => {
        it("/health - should return healthy", async () => {
            await pactum.spec().get("/health").expectStatus(200).expectJsonLike({
                healthy: true,
                uptime: /\d+/
            });
        });
    })
    describe("Auth Test - /auth", () => {
        const credentials = {
            email: faker.internet.email(),
            password: faker.internet.password({
                length: 12,
            }),
            name: faker.internet.username()
        };
        describe("POST /sign-up/email", () => {
            it("should register a new user", async () => {
                await pactum
                    .spec()
                    .post('/auth/sign-up/email')
                    .withJson(credentials)
                    .expectStatus(200)
            });
            it.each([
                ['missing email', { ...credentials, email: '' }],
                ['invalid email format', { ...credentials, email: 'invalid-email' }],
                ['missing password', { ...credentials, password: '' }],
                [
                    'weak password',
                    {
                        ...credentials,
                        password: 'weakpassword',
                    },
                ],
            ])('%s', async (testName, testCredentials) => {
                if (testName === 'weak password') {
                    // Assuming the system allows weak passwords but logs a warning
                    await pactum
                        .spec()
                        .post('/auth/sign-up/email')
                        .withJson(testCredentials)
                        .expectStatus(422);
                } else {
                    await pactum
                        .spec()
                        .post('/auth/sign-up/email')
                        .withJson(testCredentials)
                        .expectStatus(400);
                }
            });
        });
        describe("POST /sign-in/email", () => {
            it("should sign in a user", async () => {
                await pactum
                    .spec()
                    .post('/auth/sign-in/email')
                    .withJson({
                        email: credentials.email,
                        password: credentials.password,
                    })
                    .expectStatus(200)
                    .stores('authToken', 'token')
                    .inspect();
            });
            it.each([
                ['missing email', { ...credentials, email: '' }],
                ['invalid email format', { ...credentials, email: 'invalid-email' }],
                ['missing password', { ...credentials, password: '' }],
                [
                    'weak password',
                    {
                        ...credentials,
                        password: 'weakpassword',
                    },
                ],
            ])('%s', async (testName, testCredentials) => {
                if (testName === 'weak password') {
                    // Assuming the system allows weak passwords but logs a warning
                    await pactum
                        .spec()
                        .post('/auth/sign-in/email')
                        .withJson(testCredentials)
                        .expectStatus(401);
                } else {
                    await pactum
                        .spec()
                        .post('/auth/sign-up/email')
                        .withJson(testCredentials)
                        .expectStatus(400);
                }
            });
        });
        describe("User Details", () => {
            it("should check if auth is working", async () => {
                await pactum
                    .spec()
                    .get('/auth/ok')
                    .expectStatus(200)
                    .expectJsonLike({ ok: true })
            });
            it("should check if auth is working on user route", async () => {
                await pactum
                    .spec()
                    .get('/user')
                    .expectStatus(401)
            });
            it("should get current user", async () => {
                await pactum
                    .spec()
                    .get('/user')
                    .withBearerToken('$S{authToken}')
                    .expectStatus(200)
            });

        });
        describe("Gig Details", () => {

            it("should check if auth is working", async () => {
                await pactum
                    .spec()
                    .get('/gigs')
                    .expectStatus(401)

            });

            // it("should get a list user", async () => {
            //     await pactum
            //     .spec()
            //     .get('/gigs')
            //     .withBearerToken('$S{authToken}')
            //     // .withJson({
            //     //     accountId: credentials.email,
            //     // })
            //     .expectStatus(200)
            //     .inspect();
            // });

        });
        describe("LLM Integration", () => {

            it("should check if auth is working", async () => {
                await pactum
                    .spec()
                    .get('/ai/weather')
                    .withQueryParams('city', 'New York')
                    .expectStatus(401)

            });
            it("should get weather condition", async () => {
                await pactum
                    .spec()
                    .get('/ai/weather')
                    .withBearerToken('$S{authToken}')
                    .withQueryParams('city', 'New York')
                    .expectStatus(200)
                    .expectBodyContains('The weather in New York');
            }, {
                timeout: 10000
            });

            // it("should get a list user", async () => {
            //     await pactum
            //     .spec()
            //     .get('/gigs')
            //     .withBearerToken('$S{authToken}')
            //     // .withJson({
            //     //     accountId: credentials.email,
            //     // })
            //     .expectStatus(200)
            //     .inspect();
            // });

        });

    }
    );
});



