import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { api } from "../api.ts";
import { faker } from "@faker-js/faker"
import * as pactum from 'pactum';
import { clearDb, db } from "../../src/db/index.ts";


describe("Data Extractor e2e test", () => {
    beforeAll(async () => {
        pactum.request.setBaseUrl("http://localhost:3000");

    });
    afterAll(async () => {
        await clearDb()

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

    }
    );
});



