//
//  NetworkManager.swift
//  iOSGiffy
//
//  Created by Hachi on 2023-02-21.
//

import FirebaseAuth

class NetworkManager {
    static let shared = NetworkManager()

    private init() {}

    func getCurrentUserCollections(completion: @escaping (Result<[CollectionDTO], Error>) -> Void) {
        Auth.auth().currentUser?.getIDToken(completion: { idToken, error in
            guard error == nil else {
                completion(.failure(error!))
                return
            }

            guard let url = URL(string: "http://localhost:1234/mobile/collections/getCurrentUserCollections") else {
                completion(.failure(NSError(domain: "Invalid URL", code: 0, userInfo: nil)))
                return
            }

            var request = URLRequest(url: url)
            request.httpMethod = "GET"
            request.setValue("Bearer \(idToken!)", forHTTPHeaderField: "Authorization")

            URLSession.shared.dataTask(with: request) { data, response, error in
                guard error == nil else {
                    completion(.failure(error!))
                    return
                }

                guard let data = data else {
                    completion(.failure(NSError(domain: "No data received", code: 0, userInfo: nil)))
                    return
                }

                let decoder = JSONDecoder()
                do {
                    let result = try decoder.decode(GetCurrentUserCollectionsDTO.self, from: data)
                    completion(.success(result.data))
                } catch {
                    if let errorDTO = try? decoder.decode(ErrorDTO.self, from: data) {
                        completion(.failure(NSError(domain: errorDTO.error, code: 0, userInfo: nil)))
                    } else {
                        completion(.failure(error))
                    }
                }
            }.resume()
        })
    }

    func getGiffiesByCollectionId(for collection: CollectionDTO, completion: @escaping (Result<[GiffyDTO], Error>) -> Void) {
        Auth.auth().currentUser?.getIDToken(completion: { idToken, error in
            guard error == nil else {
                completion(.failure(error!))
                return
            }

            guard let url = URL(string: "http://localhost:1234/mobile/giffies/getGiffiesByCollectionId/\(collection.collectionId)") else {
                completion(.failure(NSError(domain: "Invalid URL", code: 0, userInfo: nil)))
                return
            }

            var request = URLRequest(url: url)
            request.httpMethod = "GET"
            request.setValue("Bearer \(idToken!)", forHTTPHeaderField: "Authorization")

            URLSession.shared.dataTask(with: request) { data, response, error in
                guard error == nil else {
                    completion(.failure(error!))
                    return
                }

                guard let data = data else {
                    completion(.failure(NSError(domain: "No data received", code: 0, userInfo: nil)))
                    return
                }

                let decoder = JSONDecoder()
                do {
                    let result = try decoder.decode(GetGiffiesByCollectionIdDTO.self, from: data)
                    completion(.success(result.data))
                } catch {
                    completion(.failure(error))
                }
            }.resume()
        })
    }
}
