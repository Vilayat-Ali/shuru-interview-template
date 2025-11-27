import express from 'express';
import { BaseRoute } from '../base/base.route';

export class UserRoutes extends BaseRoute {
    constructor() {
        super();

        this.registerRoute('/hello', 'get', (req, res, next) => {
            return res.json('Hello World')
        });
    }
}