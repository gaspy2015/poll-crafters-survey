<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use App\Models\SurveyAnswer;
use Illuminate\Http\Request;
use App\Http\Resources\SurveyAnswerResource;
use App\Http\Resources\SurveyResourceDashboard;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user(); //get the information of the current authorize user

        //get the total number of surveys(only the survey created by current user)
        $total = Survey::query()
        ->where('user_id', $user->id)->count();

        //get the latest survey(only the survey created by current user)
        $latest = Survey::query()
        ->where('user_id', $user->id)
        ->latest('created_at')->first();

        //get the total number of answers
        $totalAnswers = SurveyAnswer::query()
        ->join('surveys', 'survey_answers.survey_id', '=', 'surveys.id')
        ->where('surveys.user_id', $user->id)->count();

        //get the 5 latest answers
        $latestAnswers = SurveyAnswer::query()
        ->join('surveys', 'survey_answers.survey_id', '=', 'surveys.id')
        ->where('surveys.user_id', $user->id)
        ->orderBy('end_date', 'DESC')
        ->limit(5)
        ->getModels('survey_answers.*');


       return [
            'totalSurveys' => $total,
            'latestSurveys' => $latest ? new SurveyResourceDashboard($latest) : null,
            'totalAnswers' => $totalAnswers,
            'latestAnswers' => SurveyAnswerResource::collection($latestAnswers) 
       ];
    }
}
