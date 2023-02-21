//
//  DTO.swift
//  GiffyBoard
//
//  Created by Hachi on 2023-02-18.
//

import Foundation

struct ErrorDTO: Codable {
    let error: String;
}

struct GiffyResponse: Codable {
    let data: [GiffyDTO]
}

struct GiffyDTO: Codable {
    let giffyId: Int
    let collectionId: Int
    let firebaseUrl: String
    let firebaseRef: String
    let giffyName: String
    let likes: Int
}

struct GiffyCollectionsResponse: Codable {
    let data: [CollectionDTO]
}

struct CollectionDTO: Codable, Identifiable {
    let id = UUID()
    let collectionId: Int
    let collectionName: String
    let isPrivate: Bool

    enum CodingKeys: String, CodingKey {
        case collectionId, collectionName, isPrivate = "private"
    }
}
